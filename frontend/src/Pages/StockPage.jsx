import React, { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import { useStock } from '../Context/ContextoStock'

import Button from '../Components/UI/Button'

function StockPage() {

    const navigate = useNavigate()

    const {
        stock,
        stockBajo,
        obtenerStock,
        obtenerStockBajo
    } = useStock()

    useEffect(() => {

        obtenerStock()
        obtenerStockBajo()

    }, [])

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

            <div className="bg-zinc-200 rounded-xl shadow-md p-6">

                <div className="w-full">

                    {/* Encabezados */}

                    <div className="grid grid-cols-5 gap-4 border-b border-zinc-400 pb-3 font-bold text-center">

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

                    {/* Productos */}

                    {stock.map((producto) => {

                        const stockBajoProducto =
                            Number(producto.stock) <=
                            Number(producto.stock_minimo)

                        return (

                            <div
                                key={producto.id}
                                className="grid grid-cols-5 gap-4 items-center border-b border-zinc-300 py-4 text-center"
                            >

                                <div>
                                    {producto.nombre}
                                </div>

                                <div>
                                    {producto.codigo || 'Sin código'}
                                </div>

                                <div
                                    className={
                                        stockBajoProducto && producto.activo
                                            ? 'text-red-500 font-bold'
                                            : ''
                                    }
                                >
                                    {Number(producto.stock).toLocaleString('es-AR')}
                                </div>

                                <div>
                                    {Number(producto.stock_minimo).toLocaleString('es-AR')}
                                </div>

                                <div className="flex justify-center">

                                    <Button
                                        onClick={() =>
                                            navigate(
                                                `/stock/detalle/${producto.id}`
                                            )
                                        }
                                    >
                                        Modificar stock
                                    </Button>

                                </div>

                            </div>

                        )
                    })}

                </div>

            </div>

        </div>
    )
}

export default StockPage