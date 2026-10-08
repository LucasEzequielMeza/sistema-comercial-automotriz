import { Router } from 'express';

import {
    obtenerStock,
    obtenerStockPorProducto,
    aumentarStock,
    disminuirStock,
    obtenerProductosConStockBajo
} from './stock.controller.js';
import { eliminarProducto } from '../productos/productos.controller.js';

import { estaAutenticado } from '../../middleware/autenticacion.middleware.js';

const router = Router();

router.get('/', estaAutenticado(), obtenerStock);

router.get('/bajo', estaAutenticado(), obtenerProductosConStockBajo);

router.get('/:id', estaAutenticado(), obtenerStockPorProducto);

router.post('/aumentar/:id', estaAutenticado(), aumentarStock);

router.post('/disminuir/:id', estaAutenticado(), disminuirStock);

router.delete('/:id', estaAutenticado(), eliminarProducto);

export default router;