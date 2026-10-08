import {Router} from 'express';

import {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    buscarProductos,
    desactivarProducto,
    activarProducto,
    obtenerProductosDesactivados
} from './productos.controller.js';

import { estaAutenticado } from '../../middleware/autenticacion.middleware.js';

const router = Router();

router.post('/', estaAutenticado(), crearProducto);

router.get('/', estaAutenticado(), obtenerProductos);

router.get('/buscar', estaAutenticado(), buscarProductos);

router.get('/desactivados', estaAutenticado(), obtenerProductosDesactivados);

router.get('/:id', estaAutenticado(), obtenerProductoPorId);

router.put('/:id', estaAutenticado(), actualizarProducto);

router.patch('/:id/desactivar', estaAutenticado(), desactivarProducto);

router.patch('/:id/activar', estaAutenticado(), activarProducto);

export default router;