import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
};

export const generarTokenDeAcceso = (payload) => { /*El payload es un objeto que contiene la información 
 que deseas incluir en el token, como el ID del usuario, el nombre de usuario, etc.*/

    // Genera un token de acceso con una duración de 1 día
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload, 
            SECRET, // Clave secreta para firmar el token
            { expiresIn: '1d' },
            (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }}
        );
    });
};
