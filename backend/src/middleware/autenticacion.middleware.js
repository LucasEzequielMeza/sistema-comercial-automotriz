import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export const estaAutenticado = (roles = []) => async (req, res, next) => {

    // Obtenemos el token almacenado en la cookie
    const token = req.cookies.token;

    // Si no existe el token, el usuario no está autenticado
    if (!token) {
        return res.status(401).json({
            message: 'No estás autenticado'
        });
    }

    // Verificamos que el token sea válido
    jwt.verify(token, SECRET, async (err, decoded) => {

        // Si el token es inválido o expiró
        if (err) {
            return res.status(401).json({
                message: 'Token inválido o expirado'
            });
        }

        /*Guardamos el ID del usuario autenticado decoded contiene 
        el payload que guardamos al crear el token*/
        req.userId = decoded.id;

        next();
    });
};

