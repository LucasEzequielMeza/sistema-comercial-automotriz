import bcrypt from 'bcrypt';
import {pool} from '../../db.js';
import { generarTokenDeAcceso } from './jwt.js';

export const login = async (req, res) => {
    try {

        // Obtenemos las credenciales enviadas
        const { usuario, contrasena } = req.body;

        // Buscamos el usuario por su nombre de usuario
        const result = await pool.query(
            `
            SELECT *
            FROM usuarios
            WHERE usuario = $1
            `,
            [usuario]
        );

        // Si no existe el usuario
        if (result.rowCount === 0) {
            return res.status(401).json({
                success: false,
                error: 'El usuario no esta registrado'
            });
        }

        // Comparamos la contrasena ingresada con el hash almacenado en la base de datos
        const contrasenaValida = await bcrypt.compare(
            contrasena,
            result.rows[0].contrasena
        );

        // Si la contrasena no coincide
        if (!contrasenaValida) {
            return res.status(401).json({
                success: false,
                error: 'contrasena incorrecta'
            });
        }

        // Generamos el JWT con el ID del usuario
        const token = await generarTokenDeAcceso({
            id: result.rows[0].id
        });

        // Guardamos el token en una cookie HTTP-Only
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'
                ? 'none'
                : 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        // Devolvemos solamente los datos necesarios
        return res.status(200).json({
            success: true,
            usuario: {
                id: result.rows[0].id,
                usuario: result.rows[0].usuario
            }
        });

    } catch (error) {

        console.error('Error al iniciar sesión:', error);

        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};


export const register = async (req, res) => {

    // Obtenemos los datos enviados
    const {
        nombre,
        apellido,
        usuario,
        mail,
        contrasena
    } = req.body;

    try {

        // Verificamos si ya existe un usuario con ese nombre de usuario
        const existeUsuario = await pool.query(
            'SELECT id FROM usuarios WHERE usuario = $1',
            [usuario]
        );

        if (existeUsuario.rowCount > 0) {
            return res.status(400).json({
                error: 'El usuario ya existe'
            });
        }

        // Hasheamos la contrasena antes de guardarla
        const hashcontrasena = await bcrypt.hash(contrasena, 12);

        // Creamos el usuario
        const result = await pool.query(
            `
            INSERT INTO usuarios (
                nombre,
                apellido,
                usuario,
                mail,
                contrasena
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, nombre, apellido, mail, usuario
            `,
            [
                nombre,
                apellido,
                usuario,
                mail,
                hashcontrasena
            ]
        );

        // Generamos el JWT
        const token = await generarTokenDeAcceso({
            id: result.rows[0].id
        });

        // Guardamos el token en una cookie HTTP-Only
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'
                ? 'none'
                : 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            usuario: {
                id: result.rows[0].id,
                nombre: result.rows[0].nombre,
                apellido: result.rows[0].apellido,
                usuario: result.rows[0].usuario,
                mail: result.rows[0].mail
            }
        });

    } catch (error) {

        console.error('Error al registrar el usuario:', error);

        return res.status(500).json({
            error: 'Error al registrar el usuario'
        });
    }
};


export const logout = (req, res) => {

    // Eliminamos la cookie del token usando la misma configuración de producción
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production'
            ? 'none'
            : 'lax'
    });

    return res.json({
        success: true,
        message: 'Sesión cerrada'
    });
};


export const getProfile = async (req, res) => {

    try {

        const result = await pool.query(
            `
            SELECT
                id,
                nombre,
                apellido,
                mail
            FROM usuarios
            WHERE id = $1
            `,
            [req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        return res.status(200).json({
            usuario: result.rows[0]
        });

    } catch (error) {

        console.error(
            'Error al obtener el perfil:',
            error
        );

        return res.status(500).json({
            error: 'Error al obtener el perfil'
        });
    }
};