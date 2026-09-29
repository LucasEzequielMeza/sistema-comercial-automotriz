import { pool } from '../../db.js';

export const crearProveedor = async (req, res, next) => {

    const {
        nombre,
        cuit,
        telefono,
        mail,
        direccion,
        contacto,
        observaciones
    } = req.body;

    try {

        // Insertamos el proveedor en la base de datos
        const result = await pool.query(
            `INSERT INTO proveedores (
                nombre,
                cuit,
                telefono,
                mail,
                direccion,
                contacto,
                observaciones
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                nombre,
                cuit,
                telefono,
                mail,
                direccion,
                contacto,
                observaciones
            ]
        );

        const proveedorCreado = result.rows[0];

        // Devolvemos el proveedor creado
        res.status(201).json({
            message: 'Proveedor creado exitosamente',
            proveedor: proveedorCreado
        });

    } catch (error) {

        console.error('Error al crear el proveedor:', error);

        // Verificamos si el CUIT ya existe
        if (error.code === '23505') {
            return res.status(409).json({
                message: 'El CUIT del proveedor ya existe'
            });
        }

        next(error);
    }
};

export const obtenerProveedores = async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT *
            FROM proveedores
            ORDER BY nombre ASC`
        );

        res.status(200).json(result.rows);

    } catch (error) {

        console.error('Error al obtener los proveedores:', error);

        res.status(500).json({
            message: 'Error al obtener los proveedores'
        });
    }
};

export const obtenerProveedorPorId = async (req, res) => {

    const { id } = req.params;

    try {

        const result = await pool.query(
            `SELECT *
            FROM proveedores
            WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Proveedor no encontrado'
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error('Error al obtener el proveedor:', error);

        res.status(500).json({
            message: 'Error al obtener el proveedor'
        });
    }
};

export const actualizarProveedor = async (req, res) => {

    const { id } = req.params;

    const {
        nombre,
        cuit,
        telefono,
        mail,
        direccion,
        contacto,
        observaciones
    } = req.body;

    try {

        const result = await pool.query(
            `UPDATE proveedores
            SET nombre = $1,
                cuit = $2,
                telefono = $3,
                mail = $4,
                direccion = $5,
                contacto = $6,
                observaciones = $7,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $8
            RETURNING *`,
            [
                nombre,
                cuit,
                telefono,
                mail,
                direccion,
                contacto,
                observaciones,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Proveedor no encontrado'
            });
        }

        res.status(200).json({
            message: 'Proveedor actualizado exitosamente',
            proveedor: result.rows[0]
        });

    } catch (error) {

        console.error('Error al actualizar el proveedor:', error);

        // Verificamos si el CUIT ya existe
        if (error.code === '23505') {
            return res.status(409).json({
                message: 'El CUIT del proveedor ya existe'
            });
        }

        res.status(500).json({
            message: 'Error al actualizar el proveedor'
        });
    }
};

export const buscarProveedores = async (req, res) => {

    const { search } = req.query;

    try {

        const result = await pool.query(
            `SELECT *
            FROM proveedores
            WHERE nombre ILIKE $1
            OR cuit ILIKE $1
            ORDER BY nombre ASC`,
            [`%${search}%`]
        );

        res.status(200).json(result.rows);

    } catch (error) {

        console.error('Error al buscar proveedores:', error);

        res.status(500).json({
            message: 'Error al buscar proveedores'
        });
    }
};

export const desactivarProveedor = async (req, res) => {

    const { id } = req.params;

    try {

        const result = await pool.query(
            `UPDATE proveedores
            SET activo = false,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Proveedor no encontrado'
            });
        }

        res.status(200).json({
            message: 'Proveedor desactivado exitosamente',
            proveedor: result.rows[0]
        });

    } catch (error) {

        console.error('Error al desactivar el proveedor:', error);

        res.status(500).json({
            message: 'Error al desactivar el proveedor'
        });
    }
};

export const activarProveedor = async (req, res) => {

    const { id } = req.params;

    try {

        const result = await pool.query(
            `UPDATE proveedores
            SET activo = true,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Proveedor no encontrado'
            });
        }

        res.status(200).json({
            message: 'Proveedor activado exitosamente',
            proveedor: result.rows[0]
        });

    } catch (error) {

        console.error('Error al activar el proveedor:', error);

        res.status(500).json({
            message: 'Error al activar el proveedor'
        });
    }
};