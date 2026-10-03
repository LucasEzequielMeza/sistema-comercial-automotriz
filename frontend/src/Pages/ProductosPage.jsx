import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducto } from '../Context/ContextoProductos'
import ProductosCard from '../Components/productos/ProductosCard'

function ProductosPage() {

    const {
        productos,
        obtenerProductos,
        productoError,
        buscarProductos,
        desactivarProducto,
        activarProducto
    } = useProducto()

    const navigate = useNavigate()
    const [busqueda, setBusqueda] = useState('')
    const [resultadosBusqueda, setResultadosBusqueda] = useState([])

    useEffect(() => {

        obtenerProductos()

    }, [])

    const realizarBusqueda = async (texto) => {

        setBusqueda(texto)

        if (texto.trim() === '') {

            setResultadosBusqueda([])

            obtenerProductos()

            return

        }

        const resultados = await buscarProductos(texto)

        if (resultados) {

            setResultadosBusqueda(resultados)

        }

    }

    const productoDesactivado = async (id) => {

        const respuesta = await desactivarProducto(id)

        if (respuesta) {

            obtenerProductos()

        }

    }

    const productoActivado = async (id) => {

        const respuesta = await activarProducto(id)

        if (respuesta) {

            obtenerProductos()

        }

    }

    const productosMostrar =
        busqueda.trim() === ''
            ? productos
            : resultadosBusqueda

    return (

        <div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 my-6">

                <input
                    type="text"
                    placeholder="Buscar por nombre o código"
                    value={busqueda}
                    onChange={(e) =>
                        realizarBusqueda(e.target.value)
                    }
                    className="bg-white border border-[#D6D3D1] px-3 py-2 text-[#1C1917] rounded-md placeholder:text-[#78716C] focus:outline-none focus:border-[#13100F] flex-1"
                />
                <button
                    onClick={() =>
                        navigate('/productos/nuevo')
                    }
                    className="bg-[#13100F] text-white px-4 py-2 rounded-md hover:bg-[#26211F] whitespace-nowrap"
                >
                    Nuevo producto
                </button>

            </div>

            {productoError.length > 0 && (
                <div className="mb-4">
                    {productoError.map((error, index) => (
                        <p key={index} className="text-red-500">
                            {error.message || error.error || error}
                        </p>
                    ))}
                </div>

            )}

            {productosMostrar.length === 0 ? (
                <p className="text-[#57534E]">
                    No hay productos para mostrar.
                </p>
            ) : (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
                    {productosMostrar.map((producto) => (
                        <ProductosCard
                            key={producto.id}
                            producto={producto}
                            desactivarProducto={productoDesactivado}
                            activarProducto={productoActivado}
                            modoBusqueda={busqueda.trim() !== ''}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProductosPage