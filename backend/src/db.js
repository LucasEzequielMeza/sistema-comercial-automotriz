import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de la conexión con la BD
export const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});

// Evento de conexión exitosa
pool.on('connect', () => {
    console.log('Conexión exitosa a la base de datos');
});

// Evento de error en la conexión
pool.on('error', (err) => {
    console.error('Error en la conexión a la base de datos:', err);
});

// Pruebo la conexión cuando arranca el servidor
pool.query('SELECT NOW()')
    .then(() => {
        console.log('Conexión con Neon funcionando correctamente');
    })
    .catch((err) => {
        console.error('Error al conectar con Neon:', err);
    });