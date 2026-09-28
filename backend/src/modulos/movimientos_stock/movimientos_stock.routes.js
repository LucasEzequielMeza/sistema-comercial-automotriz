import { Router } from 'express';

import {
    obtenerMovimientosStock,
    obtenerMovimientosStockPorProducto
} from './movimientos_stock.controller.js';

import { estaAutenticado } from '../../middleware/autenticacion.middleware.js';

const router = Router();

router.get('/', estaAutenticado(), obtenerMovimientosStock);

router.get('/producto/:id', estaAutenticado(), obtenerMovimientosStockPorProducto);


export default router;