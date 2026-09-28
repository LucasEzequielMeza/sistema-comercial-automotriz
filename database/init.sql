**************
TABLA USUARIOS
**************
-- Creo la extensión para poder generar UUID automáticamente
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Creo la tabla de usuarios
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    mail VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL
);