import React, { createContext, useContext, useState } from 'react'
import axios from '../Api/axios.js'

export const ContextoStock = createContext()

export const useStock = () => {

    const context = useContext(ContextoStock)

    if (!context) {
        throw new Error(
            'useStock debe utilizarse dentro de StockProvider'
        )
    }

    return context
}

export function StockProvider({ children }) {

    const [stock, setStock] = useState([])
    const [stockProducto, setStockProducto] = useState(null)
    const [stockBajo, setStockBajo] = useState([])
    const [stockError, setStockError] = useState([])
    const [cargando, setCargando] = useState(false)

    const obtenerStock = async () => {

        try {

            setCargando(true)

            setStockError([])

            const respuesta = await axios.get('/stock')

            setStock(respuesta.data)

            return respuesta.data

        } catch (error) {

            console.error(
                'Error al obtener el stock:',
                error
            )

            setStockError([
                error.response?.data?.message ||
                'Error al obtener el stock'
            ])

            return null

        } finally {

            setCargando(false)

        }

    }

    const obtenerStockPorProducto = async (id) => {

        try {

            setStockError([])

            const respuesta = await axios.get(
                `/stock/${id}`
            )

            setStockProducto(respuesta.data)

            return respuesta.data

        } catch (error) {

            console.error(
                'Error al obtener el stock del producto:',
                error
            )

            setStockProducto(null)

            setStockError([
                error.response?.data?.message ||
                'Error al obtener el stock del producto'
            ])

            return null

        }

    }

    const aumentarStock = async (id, cantidad, motivo) => {

        try {

            setStockError([])

            const respuesta = await axios.post(
                `/stock/aumentar/${id}`,
                {
                    cantidad,
                    motivo
                }
            )

            const productoActualizado =
                respuesta.data.producto

            setStock((stockActual) =>
                stockActual.map((producto) =>
                    producto.id === productoActualizado.id
                        ? {
                            ...producto,
                            ...productoActualizado
                        }
                        : producto
                )
            )

            setStockProducto((productoActual) =>
                productoActual?.id === productoActualizado.id
                    ? {
                        ...productoActual,
                        ...productoActualizado
                    }
                    : productoActual
            )

            return productoActualizado

        } catch (error) {

            console.error(
                'Error al aumentar el stock:',
                error
            )

            setStockError([
                error.response?.data?.message ||
                'Error al aumentar el stock'
            ])

            return null

        }

    }

    const disminuirStock = async (id, cantidad, motivo) => {

        try {

            setStockError([])

            const respuesta = await axios.post(
                `/stock/disminuir/${id}`,
                {
                    cantidad,
                    motivo
                }
            )

            const productoActualizado =
                respuesta.data.producto

            setStock((stockActual) =>
                stockActual.map((producto) =>
                    producto.id === productoActualizado.id
                        ? {
                            ...producto,
                            ...productoActualizado
                        }
                        : producto
                )
            )

            setStockProducto((productoActual) =>
                productoActual?.id === productoActualizado.id
                    ? {
                        ...productoActual,
                        ...productoActualizado
                    }
                    : productoActual
            )

            return productoActualizado

        } catch (error) {

            console.error(
                'Error al disminuir el stock:',
                error
            )

            setStockError([
                error.response?.data?.message ||
                'Error al disminuir el stock'
            ])

            return null

        }

    }

    const obtenerStockBajo = async () => {

        try {

            setStockError([])

            const respuesta = await axios.get(
                '/stock/bajo'
            )

            setStockBajo(respuesta.data)

            return respuesta.data

        } catch (error) {

            console.error(
                'Error al obtener los productos con stock bajo:',
                error
            )

            setStockError([
                error.response?.data?.message ||
                'Error al obtener los productos con stock bajo'
            ])

            return null

        }

    }

    const limpiarStockError = () => {

        setStockError([])

    }

    return (

        <ContextoStock.Provider
            value={{
                stock,
                stockProducto,
                stockBajo,
                stockError,
                cargando,
                obtenerStock,
                obtenerStockPorProducto,
                aumentarStock,
                disminuirStock,
                obtenerStockBajo,
                limpiarStockError
            }}
        >

            {children}

        </ContextoStock.Provider>

    )

}