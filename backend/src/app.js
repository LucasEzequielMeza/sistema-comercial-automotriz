import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
// Importacion de rutas
import autenticacionRoutes from './modulos/autenticacion/autenticacion.routes.js';
import productosRoutes from './modulos/productos/productos.routes.js';
import stockRoutes from './modulos/stock/stock.routes.js';
import movimientosStockRoutes from './modulos/movimientos_stock/movimientos_stock.routes.js';
import categoriasRoutes from './modulos/categorias/categorias.routes.js';
import proveedoresRoutes from './modulos/proveedores/proveedores.routes.js';


const app = express();

// Middlewares

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Reemplaza con la URL de tu frontend
  credentials: true, // Permite enviar cookies
}));    
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api', autenticacionRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/movimientos-stock', movimientosStockRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/proveedores', proveedoresRoutes);

// Manejador de errores

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: "error",
    message: err.message
   });
});

export default app;