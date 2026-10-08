import React, { useEffect, useState } from 'react'
import { useProducto } from '../Context/ContextoProductos'
import { FaTrash, FaCheck, FaTimes } from 'react-icons/fa'

import axios from '../Api/axios.js'

function ProductosDesactivadosPage() {

    const {
        productosDesactivados,
        obtenerProductosDesactivados,
        activarProducto
    } = useProducto()

    const [busqueda, setBusqueda] = useState('')
    const [productoAEliminar, setProductoAEliminar] = useState(null)

    useEffect(() => {

        obtenerProductosDesactivados()

    }, [])

    const productoActivado = async (id) => {

        const respuesta = await activarProducto(id)

        if (respuesta) {

            obtenerProductosDesactivados()

        }

    }

    const eliminarProducto = async () => {

        try {

            await axios.delete(`/stock/${productoAEliminar.id}`)

            setProductoAEliminar(null)

            obtenerProductosDesactivados()

        } catch (error) {

            console.error('Error al eliminar el producto:', error)

            setProductoAEliminar(null)

        }

    }

    const productosMostrar = productosDesactivados.filter((producto) =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (producto.codigo &&
            producto.codigo.toLowerCase().includes(busqueda.toLowerCase()))
    )

    return (

        <div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 my-6">
                <input
                    type="text"
                    placeholder="Buscar por nombre o código"
                    value={busqueda}
                    onChange={(e) =>
                        setBusqueda(e.target.value)
                    }
                    className="bg-white border border-[#D6D3D1] px-3 py-2 text-[#1C1917] rounded-md placeholder:text-[#78716C] focus:outline-none focus:border-[#13100F] flex-1"
                />
            </div>

            {productosMostrar.length === 0 ? (
                <p className="text-[#57534E]">No hay productos desactivados.</p>

            ) : (

                <div className="grid grid-cols-[repeat(auto-fill,320px)] justify-center gap-6">
                    {productosMostrar.map((producto) => (
                        <div
                            key={producto.id}
                            className="bg-zinc-200 rounded-xl shadow-md overflow-hidden"
                        >
                            {producto.imagen ? (

                                <img
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    className="w-full h-48 object-cover"
                                />
                            ) : (
                                <div className="w-full h-48 bg-zinc-300 flex items-center justify-center text-zinc-500">Sin imagen</div>
                            )}

                            <div className="p-4">

                                <h2 className="text-xl font-bold text-[#1C1917]">{producto.nombre}</h2>
                                <p className="text-sm text-[#57534E] mt-1">Código: {producto.codigo || 'Sin código'}</p>
                                <p className="text-sm text-[#57534E]">Categoría: {producto.categoria_nombre || 'Sin categoría'}</p>
                                <p className="text-sm text-[#57534E]">Stock: {Number(producto.stock).toLocaleString('es-AR')}</p>
                                <p className="text-sm text-[#57534E]">Precio de venta: ${Number(producto.precio_venta).toLocaleString('es-AR')}</p>
                                <div className="flex justify-center gap-2 mt-4">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            productoActivado(producto.id)
                                        }
                                        className="bg-[#13100F] text-white px-4 py-2 rounded-md hover:bg-[#26211F] whitespace-nowrap"
                                        title="Activar producto"
                                    >
                                        Activar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setProductoAEliminar(producto)
                                        }
                                        className="bg-red-500 hover:bg-red-600 text-white rounded-md px-3 py-2 transition"
                                        title="Eliminar producto"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {productoAEliminar && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-red-100 text-red-500 rounded-full p-4">
                                <FaTrash size={24} />
                            </div>
                        </div>

                        <h2 className="text-xl font-bold mb-2">Eliminar producto</h2>
                        <p className="text-zinc-600 mb-6">
                            ¿Estás seguro de que querés eliminar "{productoAEliminar.nombre}"?
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => setProductoAEliminar(null)}
                                className="flex items-center gap-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 rounded-md px-4 py-2 transition"
                            >
                                <FaTimes />
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={eliminarProducto}
                                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2 transition"
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

export default ProductosDesactivadosPage