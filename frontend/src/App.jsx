import { useState } from 'react'
import {Routes, Route, Navigate, useLocation} from 'react-router-dom'
import RegisterPage from './Pages/RegisterPage'
import LoginPage from './Pages/LoginPage'
import ProductosPage from './Pages/ProductosPage'
import StockPage from './Pages/StockPage'
import ProductosForm from './Components/productos/ProductosForm'
import ProductosDetalle from './Components/productos/ProductosDetalle'
import StockDetalle from './Components/stock/StockDetalle'
import Navbar from './Components/navbar/Navbar'
import Container from './Components/UI/Container'
import RutaProtegida from './Components/autorizacion/RutaProtegida'
import ProductosDesactivadosPage from './Pages/ProductosDesactivadosPage'

function App() {

    const [menuAbierto, setMenuAbierto] = useState(true)
    const location = useLocation()

    const esPaginaAutenticacion = location.pathname === "/iniciar-sesion" || location.pathname === "/registro"

    return (
        <>
            {!esPaginaAutenticacion && (
                <Navbar
                    menuAbierto={menuAbierto}
                    setMenuAbierto={setMenuAbierto}
                />
            )}

            <main
                className={
                    esPaginaAutenticacion
                        ? "min-h-screen"
                        : `min-h-screen transition-all duration-300 ${
                            menuAbierto
                                ? "pt-[330px] md:pt-0 md:ml-64"
                                : "pt-14 md:pt-0 md:ml-20"
                        }`
                }
            >

                <Container>
                    <Routes>

                        <Route path="/" element={<Navigate to="/productos" replace />}/>
                        <Route path="/iniciar-sesion" element={<LoginPage />}/>
                        <Route path="/registro" element={<RegisterPage />}/>
                        <Route path="/register" element={<Navigate to="/registro" replace />}/>

                        <Route element={<RutaProtegida />}>

                            <Route path="/productos" element={<ProductosPage />}/>
                            <Route path="/productos/desactivados" element={<ProductosDesactivadosPage />}/>
                            <Route path="/productos/nuevo" element={<ProductosForm />}/>
                            <Route path="/productos/:id/edit" element={<ProductosForm />}/>
                            <Route path="/producto/detalle/:id" element={<ProductosDetalle />}/>

                            <Route path="/stock" element={<StockPage />}/>
                            <Route path="/stock/detalle/:id" element={<StockDetalle />}/>

                        </Route>
                        <Route path="*" element={<Navigate to="/productos" replace />}/>
                    </Routes>
                </Container>
            </main>
        </>
    )
}

export default App