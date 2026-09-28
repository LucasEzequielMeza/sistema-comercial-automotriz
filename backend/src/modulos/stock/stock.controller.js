import { pool } from '../../db.js';

export const obtenerStock = async (req, res) => {

    try {

        // Obtenemos el stock de todos los productos
        const result = await pool.query(
            `SELECT id, nombre, codigo, stock, stock_minimo, activo
            FROM productos
            ORDER BY nombre ASC`
        );

        res.status(200).json(result.rows);

    } catch (error) {

        console.error('Error al obtener el stock:', error);

        res.status(500).json({
            message: 'Error al obtener el stock'
        });
    }
};


export const obtenerStockPorProducto = async (req, res) => {

    const { id } = req.params;

    try {

        // Buscamos el stock del producto indicado
        const result = await pool.query(
            `SELECT id, nombre, codigo, stock, stock_minimo, activo
            FROM productos
            WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error('Error al obtener el stock del producto:', error);

        res.status(500).json({
            message: 'Error al obtener el stock del producto'
        });
    }
};


export const aumentarStock = async (req, res) => {

    const { id } = req.params;
    const { cantidad, motivo } = req.body;

    const usuarioId = req.userId;

    const client = await pool.connect();

    try {

        // Verificamos que la cantidad sea válida
        if (!cantidad || cantidad <= 0) {
            return res.status(400).json({
                message: 'La cantidad debe ser mayor a 0'
            });
        }

        // Verificamos que se haya indicado un motivo
        if (!motivo) {
            return res.status(400).json({
                message: 'El motivo es obligatorio'
            });
        }

        // Iniciamos una transacción
        await client.query('BEGIN');

        // Obtenemos el producto y bloqueamos la fila mientras hacemos el movimiento
        const productoResult = await client.query(
            `SELECT id, nombre, codigo, stock, stock_minimo, activo
            FROM productos
            WHERE id = $1
            FOR UPDATE`,
            [id]
        );

        if (productoResult.rows.length === 0) {
            await client.query('ROLLBACK');

            return res.status(404).json({
                message: 'Producto no encontrado'
            });
        }

        const producto = productoResult.rows[0];

        const stockAnterior = Number(producto.stock);
        const stockNuevo = stockAnterior + Number(cantidad);

        // Actualizamos el stock del producto
        const result = await client.query(
            `UPDATE productos
            SET stock = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING id, nombre, codigo, stock, stock_minimo, activo`,
            [stockNuevo, id]
        );

        // Guardamos el movimiento en el historial
        await client.query(
            `INSERT INTO movimientos_stock (
                producto_id,
                tipo,
                cantidad,
                motivo,
                stock_anterior,
                stock_nuevo,
                usuario_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                id,
                'entrada',
                cantidad,
                motivo,
                stockAnterior,
                stockNuevo,
                usuarioId
            ]
        );

        // Si todo salió bien, confirmamos la transacción
        await client.query('COMMIT');

        res.status(200).json({
            message: 'Stock aumentado exitosamente',
            producto: result.rows[0]
        });

    } catch (error) {

        // Si algo falla, deshacemos todos los cambios
        await client.query('ROLLBACK');

        console.error('Error al aumentar el stock:', error);

        res.status(500).json({
            message: 'Error al aumentar el stock'
        });

    } finally {

        // Liberamos la conexión
        client.release();
    }
};


export const disminuirStock = async (req, res) => {

    const { id } = req.params;
    const { cantidad, motivo } = req.body;

    const usuarioId = req.userId;

    const client = await pool.connect();

    try {

        // Verificamos que la cantidad sea válida
        if (!cantidad || cantidad <= 0) {
            return res.status(400).json({
                message: 'La cantidad debe ser mayor a 0'
            });
        }

        // Verificamos que se haya indicado un motivo
        if (!motivo) {
            return res.status(400).json({
                message: 'El motivo es obligatorio'
            });
        }

        // Iniciamos una transacción
        await client.query('BEGIN');

        // Obtenemos el producto y bloqueamos la fila mientras hacemos el movimiento
        const productoResult = await client.query(
            `SELECT id, nombre, codigo, stock, stock_minimo, activo
            FROM productos
            WHERE id = $1
            FOR UPDATE`,
            [id]
        );

        if (productoResult.rows.length === 0) {
            await client.query('ROLLBACK');

            return res.status(404).json({
                message: 'Producto no encontrado'
            });
        }

        const producto = productoResult.rows[0];

        const stockAnterior = Number(producto.stock);
        const stockNuevo = stockAnterior - Number(cantidad);

        // Verificamos que no quede stock negativo
        if (stockNuevo < 0) {
            await client.query('ROLLBACK');

            return res.status(400).json({
                message: 'No hay suficiente stock disponible'
            });
        }

        // Actualizamos el stock del producto
        const result = await client.query(
            `UPDATE productos
            SET stock = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING id, nombre, codigo, stock, stock_minimo, activo`,
            [stockNuevo, id]
        );

        // Guardamos el movimiento en el historial
        await client.query(
            `INSERT INTO movimientos_stock (
                producto_id,
                tipo,
                cantidad,
                motivo,
                stock_anterior,
                stock_nuevo,
                usuario_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                id,
                'salida',
                cantidad,
                motivo,
                stockAnterior,
                stockNuevo,
                usuarioId
            ]
        );

        // Si todo salió bien, confirmamos la transacción
        await client.query('COMMIT');

        res.status(200).json({
            message: 'Stock disminuido exitosamente',
            producto: result.rows[0]
        });

    } catch (error) {

        // Si algo falla, deshacemos todos los cambios
        await client.query('ROLLBACK');

        console.error('Error al disminuir el stock:', error);

        res.status(500).json({
            message: 'Error al disminuir el stock'
        });

    } finally {

        // Liberamos la conexión
        client.release();
    }
};


export const obtenerProductosConStockBajo = async (req, res) => {

    try {

        // Buscamos los productos que llegaron al stock mínimo o están por debajo
        const result = await pool.query(
            `SELECT id, nombre, codigo, stock, stock_minimo, activo
            FROM productos
            WHERE stock <= stock_minimo
            AND activo = true
            ORDER BY stock ASC`
        );

        res.status(200).json(result.rows);

    } catch (error) {

        console.error('Error al obtener los productos con stock bajo:', error);

        res.status(500).json({
            message: 'Error al obtener los productos con stock bajo'
        });
    }
};