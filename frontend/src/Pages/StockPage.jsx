import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStock } from '../Context/ContextoStock'
import Button from '../Components/UI/Button'
import axios from '../Api/axios'

import { FaTrash } from 'react-icons/fa'
import { FaCheck } from 'react-icons/fa'
import { FaTimes } from 'react-icons/fa'

function StockPage() {

    const navigate = useNavigate()

    const {
        stock,
        stockBajo,
        obtenerStock,
        obtenerStockBajo
    } = useStock()

    const [productoAEliminar, setProductoAEliminar] = useState(null)

    useEffect(() => {

        obtenerStock()
        obtenerStockBajo()

    }, [])

    const eliminarProducto = async () => {

        try {

            await axios.delete(`/stock/${productoAEliminar.id}`)

            setProductoAEliminar(null)

            await obtenerStock()
            await obtenerStockBajo()

        } catch (error) {

            console.error('Error al eliminar el producto:', error)

            setProductoAEliminar(null)

        }
    }

    return (

        <div className="min-h-screen">

            <h1 className="text-3xl font-bold mb-6 text-center">
                Stock
            </h1>

            {stockBajo.length > 0 && (

                <div className="mb-6 text-center">

                    <p className="text-red-500 font-bold">
                        Hay productos con stock bajo.
                    </p>

                </div>

            )}

            <div className="bg-zinc-200 rounded-xl shadow-md p-4 sm:p-6">

                <div className="w-full">

                    {/* Vista de escritorio */}

                    <div className="hidden md:grid md:grid-cols-5 gap-4 border-b border-zinc-400 pb-3 font-bold text-center">

                        <div>
                            Nombre
                        </div>

                        <div>
                            Código
                        </div>

                        <div>
                            Stock actual
                        </div>

                        <div>
                            Stock mínimo
                        </div>

                        <div>
                            Acción
                        </div>

                    </div>

                    {stock.map((producto) => {

                        const stockBajoProducto =
                            Number(producto.stock) <=
                            Number(producto.stock_minimo)

                        return (

                            <div
                                key={producto.id}
                                className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center border-b border-zinc-300 py-4 last:border-b-0"
                            >

                                <div className="min-w-0 text-center md:text-left">

                                    <span className="font-bold md:hidden">
                                        Nombre:{' '}
                                    </span>

                                    <span className="break-words">
                                        {producto.nombre}
                                    </span>

                                </div>

                                <div className="min-w-0 text-center md:text-left">

                                    <span className="font-bold md:hidden">
                                        Código:{' '}
                                    </span>

                                    <span className="break-all">
                                        {producto.codigo || 'Sin código'}
                                    </span>

                                </div>

                                <div
                                    className={`text-center md:text-left ${
                                        stockBajoProducto && producto.activo
                                            ? 'text-red-500 font-bold'
                                            : ''
                                    }`}
                                >

                                    <span className="font-bold md:hidden text-zinc-900">
                                        Stock actual:{' '}
                                    </span>

                                    {Number(producto.stock).toLocaleString('es-AR')}

                                </div>

                                <div className="text-center md:text-left">

                                    <span className="font-bold md:hidden">
                                        Stock mínimo:{' '}
                                    </span>

                                    {Number(producto.stock_minimo).toLocaleString('es-AR')}

                                </div>

                                <div className="flex flex-col sm:flex-row md:justify-center gap-2">

                                    <Button
                                        className="grid grid-cols-[repeat(auto-fill,320px)] justify-center gap-6"
                                        onClick={() =>
                                            navigate(
                                                `/stock/detalle/${producto.id}`
                                            )
                                        }
                                    >
                                        Modificar stock
                                    </Button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setProductoAEliminar(producto)
                                        }
                                        className="bg-red-500 hover:bg-red-600 text-white rounded-md px-3 py-2 transition flex items-center justify-center"
                                        title="Eliminar producto"
                                    >
                                        <FaTrash />
                                    </button>

                                </div>

                            </div>

                        )

                    })}

                </div>

            </div>

            {productoAEliminar && (

                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md text-center">

                        <div className="flex justify-center mb-4">

                            <div className="bg-red-100 text-red-500 rounded-full p-4">

                                <FaTrash size={24} />

                            </div>

                        </div>

                        <h2 className="text-xl font-bold mb-2">
                            Eliminar producto
                        </h2>

                        <p className="text-zinc-600 mb-6 break-words">
                            ¿Estás seguro de que querés eliminar "{productoAEliminar.nombre}"?
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-3">

                            <button
                                type="button"
                                onClick={() => setProductoAEliminar(null)}
                                className="flex items-center justify-center gap-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 rounded-md px-4 py-2 transition"
                            >
                                <FaTimes />
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={eliminarProducto}
                                className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2 transition"
                            >
                                <FaCheck />
                                Eliminar
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    )

}

export default StockPage