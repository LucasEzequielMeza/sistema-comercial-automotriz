import {pool} from '../../db.js';

export const crearProducto = async (req, res, next) => {
    const {
        nombre, descripcion, imagen, codigo,
        categoria_id,
        precio_compra, precio_venta, stock,
        stock_minimo,
    } = req.body;

    const client = await pool.connect();

    try {

        // Iniciamos una transacción
        await client.query('BEGIN');

        // Insertamos el producto en la base de datos
        const result = await client.query(
            `INSERT INTO productos (nombre, descripcion, imagen, codigo, categoria_id, precio_compra, precio_venta, stock, stock_minimo)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [nombre, descripcion, imagen, codigo, categoria_id, precio_compra, precio_venta, stock, stock_minimo]
        );

        const productoCreado = result.rows[0];

        // Si todo va bien, confirmamos la transacción
        await client.query('COMMIT');

        // Devolvemos el producto creado como respuesta
        res.status(201).json({
            message: "Producto creado exitosamente",
            producto: productoCreado
        });

    } catch (error) {
        
        // Si algo falla, deshacemos todos los cambios
        await client.query('ROLLBACK');

        console.error('Error al crear el producto:', error);

        if (error.code === "23505") {
            return res.status(409).json({
                message: "El código del producto ya existe"
            });
        }

        next(error);

    } finally {
        // Liberamos la conexión
        client.release();
    }
}

export const obtenerProductos = async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT
                productos.id,
                productos.nombre,
                productos.descripcion,
                productos.imagen,
                productos.codigo,
                productos.categoria_id,
                categorias.nombre AS categoria_nombre,
                productos.precio_compra,
                productos.precio_venta,
                productos.stock,
                productos.stock_minimo,
                productos.activo,
                productos.created_at,
                productos.updated_at
            FROM productos
            LEFT JOIN categorias
                ON productos.categoria_id = categorias.id
            ORDER BY productos.nombre ASC`
        );

        res.status(200).json(result.rows);

    } catch (error) {

        console.error('Error al obtener los productos:', error);

        res.status(500).json({ message: 'Error al obtener los productos' });

    }
}

export const obtenerProductoPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT
                productos.id,
                productos.nombre,
                productos.descripcion,
                productos.imagen,
                productos.codigo,
                productos.categoria_id,
                categorias.nombre AS categoria_nombre,
                productos.precio_compra,
                productos.precio_venta,
                productos.stock,
                productos.stock_minimo,
                productos.activo,
                productos.created_at,
                productos.updated_at
            FROM productos
            LEFT JOIN categorias
                ON productos.categoria_id = categorias.id
            WHERE productos.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error('Error al obtener el producto:', error);

        res.status(500).json({ message: 'Error al obtener el producto' });

    }
}

export const actualizarProducto = async (req, res) => {

    const { id } = req.params;

    const {
        nombre, descripcion, imagen, codigo,
        categoria_id,
        precio_compra, precio_venta, stock,
        stock_minimo,
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE productos 
            SET nombre = $1, descripcion = $2, imagen = $3, codigo = $4, categoria_id = $5,
                precio_compra = $6, precio_venta = $7, stock = $8, stock_minimo = $9
            WHERE id = $10 RETURNING *`,
            [nombre, descripcion, imagen, codigo, categoria_id, precio_compra, precio_venta, stock, stock_minimo, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({
            message: "Producto actualizado exitosamente",
            producto: result.rows[0]
        });

    } catch (error) {
        
        console.error('Error al actualizar el producto:', error);

        res.status(500).json({ message: 'Error al actualizar el producto' });

    }
}

export const buscarProductos = async (req, res) => {

    const {search} = req.query;

    try {
        const result = await pool.query(
            `SELECT * FROM productos 
            WHERE nombre ILIKE $1 OR codigo ILIKE $1`,
            [`%${search}%`]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        
        console.error('Error al buscar productos:', error);

        res.status(500).json({ message: 'Error al buscar productos' });

    }
}

export const desactivarProducto = async (req, res) => {

    const { id } = req.params;

    try {
        const result = await pool.query(

            `UPDATE productos 
            SET activo = false 
            WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error('Error al desactivar el producto:', error);

        res.status(500).json({ message: 'Error al desactivar el producto' });
    }
}

export const activarProducto = async (req, res) => {

    const { id } = req.params;

    try {
        const result = await pool.query(
            `UPDATE productos
            SET activo = true
            WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error('Error al activar el producto:', error);

        res.status(500).json({ message: 'Error al activar el producto' });
    }
}