import { pool } from '../../db.js';


// Creamos una nueva categoría
export const crearCategoria = async (req, res, next) => {

    const {
        nombre,
        descripcion
    } = req.body;

    try {

        // Insertamos la categoría en la base de datos
        const result = await pool.query(
            `INSERT INTO categorias (nombre, descripcion)
            VALUES ($1, $2)
            RETURNING *`,
            [nombre, descripcion]
        );

        const categoriaCreada = result.rows[0];

        // Devolvemos la categoría creada
        res.status(201).json({
            message: 'Categoría creada exitosamente',
            categoria: categoriaCreada
        });

    } catch (error) {

        console.error('Error al crear la categoría:', error);

        // Verificamos si el nombre ya existe
        if (error.code === '23505') {
            return res.status(409).json({
                message: 'La categoría ya existe'
            });
        }

        next(error);
    }
};


// Obtenemos todas las categorías
export const obtenerCategorias = async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT *
            FROM categorias
            ORDER BY nombre ASC`
        );

        res.status(200).json(result.rows);

    } catch (error) {

        console.error('Error al obtener las categorías:', error);

        res.status(500).json({
            message: 'Error al obtener las categorías'
        });
    }
};


// Obtenemos una categoría por su ID
export const obtenerCategoriaPorId = async (req, res) => {

    const { id } = req.params;

    try {

        const result = await pool.query(
            `SELECT *
            FROM categorias
            WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Categoría no encontrada'
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error('Error al obtener la categoría:', error);

        res.status(500).json({
            message: 'Error al obtener la categoría'
        });
    }
};


// Actualizamos una categoría
export const actualizarCategoria = async (req, res) => {

    const { id } = req.params;

    const {
        nombre,
        descripcion
    } = req.body;

    try {

        const result = await pool.query(
            `UPDATE categorias
            SET nombre = $1,
                descripcion = $2,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING *`,
            [nombre, descripcion, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Categoría no encontrada'
            });
        }

        res.status(200).json({
            message: 'Categoría actualizada exitosamente',
            categoria: result.rows[0]
        });

    } catch (error) {

        console.error('Error al actualizar la categoría:', error);

        if (error.code === '23505') {
            return res.status(409).json({
                message: 'La categoría ya existe'
            });
        }

        res.status(500).json({
            message: 'Error al actualizar la categoría'
        });
    }
};


// Buscamos categorías por nombre
export const buscarCategorias = async (req, res) => {

    const { search } = req.query;

    try {

        const result = await pool.query(
            `SELECT *
            FROM categorias
            WHERE nombre ILIKE $1
            ORDER BY nombre ASC`,
            [`%${search}%`]
        );

        res.status(200).json(result.rows);

    } catch (error) {

        console.error('Error al buscar categorías:', error);

        res.status(500).json({
            message: 'Error al buscar categorías'
        });
    }
};


// Desactivamos una categoría
export const desactivarCategoria = async (req, res) => {

    const { id } = req.params;

    try {

        const result = await pool.query(
            `UPDATE categorias
            SET activo = false,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Categoría no encontrada'
            });
        }

        res.status(200).json({
            message: 'Categoría desactivada exitosamente',
            categoria: result.rows[0]
        });

    } catch (error) {

        console.error('Error al desactivar la categoría:', error);

        res.status(500).json({
            message: 'Error al desactivar la categoría'
        });
    }
};


// Activamos una categoría
export const activarCategoria = async (req, res) => {

    const { id } = req.params;

    try {

        const result = await pool.query(
            `UPDATE categorias
            SET activo = true,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Categoría no encontrada'
            });
        }

        res.status(200).json({
            message: 'Categoría activada exitosamente',
            categoria: result.rows[0]
        });

    } catch (error) {

        console.error('Error al activar la categoría:', error);

        res.status(500).json({
            message: 'Error al activar la categoría'
        });
    }
};