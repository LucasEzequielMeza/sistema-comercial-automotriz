import { Router } from 'express';

import {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaPorId,
    actualizarCategoria,
    buscarCategorias,
    desactivarCategoria,
    activarCategoria
} from './categorias.controller.js';

import { estaAutenticado } from '../../middleware/autenticacion.middleware.js';

const router = Router();

router.post('/', estaAutenticado(), crearCategoria);

router.get('/buscar', estaAutenticado(), buscarCategorias);

router.get('/', estaAutenticado(), obtenerCategorias);

router.get('/:id', estaAutenticado(), obtenerCategoriaPorId);

router.put('/:id', estaAutenticado(), actualizarCategoria);

router.put('/:id/desactivar', estaAutenticado(), desactivarCategoria);

router.put('/:id/activar', estaAutenticado(), activarCategoria);


export default router;