import {Router} from 'express';

import {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    buscarProductos,
    desactivarProducto,
    activarProducto
} from './productos.controller.js';

import { estaAutenticado } from '../../middleware/autenticacion.middleware.js';

const router = Router();

router.post('/', estaAutenticado(), crearProducto);

router.get('/', estaAutenticado(), obtenerProductos);

router.get('/buscar', estaAutenticado(), buscarProductos);

router.get('/:id', estaAutenticado(), obtenerProductoPorId);

router.put('/:id', estaAutenticado(), actualizarProducto);

router.put('/desactivar/:id', estaAutenticado(), desactivarProducto);

router.put('/activar/:id', estaAutenticado(), activarProducto);

export default router;