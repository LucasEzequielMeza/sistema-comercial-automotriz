import React, { createContext, useContext, useState } from 'react'
import axios from '../Api/axios.js'
export const ContextoProducto = createContext()

export const useProducto = () => {
    const context = useContext(ContextoProducto)
    if (!context) {
        throw new Error(
            'useProducto debe utilizarse dentro de ProductoProvider'
        )
    }
    return context
}

export function ProductoProvider({ children }) {

    const [productos, setProductos] = useState([])
    const [producto, setProducto] = useState(null)
    const [productoError, setProductoError] = useState([])
    const [cargando, setCargando] = useState(false)

    const obtenerProductos = async () => {

        try {

            setCargando(true)

            setProductoError([])

            const respuesta = await axios.get('/productos')

            setProductos(respuesta.data)

            return respuesta.data

        } catch (error) {

            console.error('Error al obtener los productos:', error)

            setProductoError([
                error.response?.data?.message ||
                'Error al obtener los productos'
            ])

            return null

        } finally {

            setCargando(false)

        }

    }

    const obtenerProductoPorId = async (id) => {

        try {

            setProductoError([])

            const respuesta = await axios.get(`/productos/${id}`)

            setProducto(respuesta.data)

            return respuesta.data

        } catch (error) {

            console.error('Error al obtener el producto:', error)

            setProducto(null)

            setProductoError([
                error.response?.data?.message ||
                'Error al obtener el producto'
            ])

            return null

        }

    }

    const crearProducto = async (data) => {

        try {

            setProductoError([])

            const respuesta = await axios.post('/productos', data)

            const productoCreado = respuesta.data.producto

            setProductos((productosActuales) => [
                ...productosActuales,
                productoCreado
            ])

            return productoCreado

        } catch (error) {

            console.error('Error al crear el producto:', error)

            setProductoError([
                error.response?.data?.message ||
                'Error al crear el producto'
            ])

            return null

        }

    }

    const actualizarProducto = async (id, data) => {

        try {

            setProductoError([])

            const respuesta = await axios.put(
                `/productos/${id}`,
                data
            )

            const productoActualizado = respuesta.data.producto

            setProductos((productosActuales) =>
                productosActuales.map((productoItem) =>
                    productoItem.id === productoActualizado.id
                        ? {
                            ...productoItem,
                            ...productoActualizado
                        }
                        : productoItem
                )
            )

            setProducto((productoActual) =>
                productoActual?.id === productoActualizado.id
                    ? {
                        ...productoActual,
                        ...productoActualizado
                    }
                    : productoActual
            )

            return productoActualizado

        } catch (error) {

            console.error('Error al actualizar el producto:', error)

            setProductoError([
                error.response?.data?.message ||
                'Error al actualizar el producto'
            ])

            return null

        }

    }

    const buscarProductos = async (texto) => {

        try {

            setProductoError([])

            const respuesta = await axios.get(
                `/productos/buscar?search=${encodeURIComponent(texto)}`
            )

            return respuesta.data

        } catch (error) {

            console.error('Error al buscar productos:', error)

            setProductoError([
                error.response?.data?.message ||
                'Error al buscar productos'
            ])

            return null

        }

    }

    const desactivarProducto = async (id) => {

        try {

            setProductoError([])

            const respuesta = await axios.patch(
                `/productos/${id}/desactivar`
            )

            const productoActualizado = respuesta.data

            setProductos((productosActuales) =>
                productosActuales.map((productoItem) =>
                    productoItem.id === productoActualizado.id
                        ? {
                            ...productoItem,
                            ...productoActualizado
                        }
                        : productoItem
                )
            )

            return productoActualizado

        } catch (error) {

            console.error('Error al desactivar el producto:', error)

            setProductoError([
                error.response?.data?.message ||
                'Error al desactivar el producto'
            ])

            return null

        }

    }

    const activarProducto = async (id) => {

        try {

            setProductoError([])

            const respuesta = await axios.patch(
                `/productos/${id}/activar`
            )

            const productoActualizado = respuesta.data

            setProductos((productosActuales) =>
                productosActuales.map((productoItem) =>
                    productoItem.id === productoActualizado.id
                        ? {
                            ...productoItem,
                            ...productoActualizado
                        }
                        : productoItem
                )
            )

            return productoActualizado

        } catch (error) {

            console.error('Error al activar el producto:', error)

            setProductoError([
                error.response?.data?.message ||
                'Error al activar el producto'
            ])

            return null

        }

    }

    const limpiarProductoError = () => {

        setProductoError([])

    }

    return (

        <ContextoProducto.Provider
            value={{
                productos,
                producto,
                productoError,
                cargando,
                obtenerProductos,
                obtenerProductoPorId,
                crearProducto,
                actualizarProducto,
                buscarProductos,
                desactivarProducto,
                activarProducto,
                limpiarProductoError
            }}
        >

            {children}

        </ContextoProducto.Provider>

    )

}