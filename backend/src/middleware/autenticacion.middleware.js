import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export const estaAutenticado = (roles = []) => async (req, res, next) => {

    // Obtenemos el token enviado en el header Authorization
    const authorization = req.headers.authorization;

    // Si no existe el header o no tiene el formato correcto
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'No estás autenticado'
        });
    }

    // Extraemos solamente el token
    const token = authorization.split(' ')[1];

    // Verificamos que el token sea válido
    jwt.verify(token, SECRET, async (err, decoded) => {

        // Si el token es inválido o expiró
        if (err) {
            return res.status(401).json({
                message: 'Token inválido o expirado'
            });
        }

        // Guardamos el ID del usuario autenticado
        req.userId = decoded.id;

        next();
    });
};