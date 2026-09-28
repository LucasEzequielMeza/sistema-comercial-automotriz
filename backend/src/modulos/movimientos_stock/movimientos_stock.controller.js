import { pool } from '../../db.js';


// Obtenemos todos los movimientos de stock
export const obtenerMovimientosStock = async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT
                movimientos_stock.id,
                movimientos_stock.producto_id,
                productos.nombre AS producto_nombre,
                productos.codigo AS producto_codigo,
                movimientos_stock.tipo,
                movimientos_stock.cantidad,
                movimientos_stock.motivo,
                movimientos_stock.stock_anterior,
                movimientos_stock.stock_nuevo,
                movimientos_stock.usuario_id,
                usuarios.nombre AS usuario_nombre,
                usuarios.apellido AS usuario_apellido,
                movimientos_stock.created_at
            FROM movimientos_stock
            INNER JOIN productos
                ON movimientos_stock.producto_id = productos.id
            LEFT JOIN usuarios
                ON movimientos_stock.usuario_id = usuarios.id
            ORDER BY movimientos_stock.created_at DESC`
        );

        res.status(200).json(result.rows);

    } catch (error) {

        console.error('Error al obtener los movimientos de stock:', error);

        res.status(500).json({
            message: 'Error al obtener los movimientos de stock'
        });
    }
};


// Obtenemos los movimientos de un producto específico
export const obtenerMovimientosStockPorProducto = async (req, res) => {

    const { id } = req.params;

    try {

        // Primero verificamos que el producto exista
        const productoResult = await pool.query(
            `SELECT id, nombre, codigo
            FROM productos
            WHERE id = $1`,
            [id]
        );

        if (productoResult.rows.length === 0) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            });
        }

        // Buscamos todos los movimientos de ese producto
        const result = await pool.query(
            `SELECT
                movimientos_stock.id,
                movimientos_stock.producto_id,
                productos.nombre AS producto_nombre,
                productos.codigo AS producto_codigo,
                movimientos_stock.tipo,
                movimientos_stock.cantidad,
                movimientos_stock.motivo,
                movimientos_stock.stock_anterior,
                movimientos_stock.stock_nuevo,
                movimientos_stock.usuario_id,
                usuarios.nombre AS usuario_nombre,
                usuarios.apellido AS usuario_apellido,
                movimientos_stock.created_at
            FROM movimientos_stock
            INNER JOIN productos
                ON movimientos_stock.producto_id = productos.id
            LEFT JOIN usuarios
                ON movimientos_stock.usuario_id = usuarios.id
            WHERE movimientos_stock.producto_id = $1
            ORDER BY movimientos_stock.created_at DESC`,
            [id]
        );

        res.status(200).json(result.rows);

    } catch (error) {

        console.error('Error al obtener los movimientos del producto:', error);

        res.status(500).json({
            message: 'Error al obtener los movimientos del producto'
        });
    }
};