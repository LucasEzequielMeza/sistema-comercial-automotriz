import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStock } from '../../Context/ContextoStock'
import Card from '../UI/Card'
import Button from '../UI/Button'
import Input from '../UI/Input'
import Label from '../UI/Label'

function StockDetalle() {

    const { id } = useParams()
    const navigate = useNavigate()
    const {
        stockProducto,
        obtenerStockPorProducto,
        aumentarStock,
        disminuirStock,
        stockError
    } = useStock()

    const [cantidad, setCantidad] = useState('')
    const [motivo, setMotivo] = useState('')
    const [tipoMovimiento, setTipoMovimiento] = useState('entrada')
    const [mensaje, setMensaje] = useState('')

    useEffect(() => {
        obtenerStockPorProducto(id)
    }, [id])

    useEffect(() => {
        if (!mensaje) {
            return
        }
        const temporizador = setTimeout(() => {

            setMensaje('')

        }, 10000)

        return () => clearTimeout(temporizador)
    }, [mensaje])

    const realizarMovimiento = async (e) => {

        e.preventDefault()

        setMensaje('')

        if (!cantidad || Number(cantidad) <= 0) {
            return
        }

        if (!motivo.trim()) {
            return
        }

        let respuesta

        if (tipoMovimiento === 'entrada') {

            respuesta = await aumentarStock(
                id,
                cantidad,
                motivo
            )

        } else {

            respuesta = await disminuirStock(
                id,
                cantidad,
                motivo
            )

        }

        if (respuesta) {

            setCantidad('')

            setMotivo('')

            setMensaje(
                tipoMovimiento === 'entrada'
                    ? 'Stock aumentado exitosamente'
                    : 'Stock disminuido exitosamente'
            )

            setTimeout(() => {

                navigate('/stock')

            }, 1000)

        }

    }

    if (!stockProducto) {

        return (
            <div className="flex justify-center mt-10">
                <p>Cargando stock...</p>
            </div>

        )

    }

    const stockBajo =
        Number(stockProducto.stock) <=
        Number(stockProducto.stock_minimo)
    return (

        <div>

            <div className="w-full max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 my-6">
                <h1 className="text-2xl font-bold text-[#1C1917]">Detalle del stock</h1>
                <Button onClick={() => navigate('/stock')}>Volver</Button>
            </div>

            {stockError.length > 0 && (
                <div className="mb-4">
                    {stockError.map((error, index) => (

                        <p key={index} className="text-red-500">
                            {error.message ||
                                error.error ||
                                error}
                        </p>
                    ))}
                </div>
            )}

            {mensaje && (
                <div className="flex justify-center mb-6">
                    <p className="text-green-600 font-bold text-center">{mensaje}</p>
                </div>
            )}

            <Card className="w-full max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">{stockProducto.nombre}</h2>

                <div className="space-y-3">
                    <p><span className="font-bold">Código:</span>{' '}{stockProducto.codigo ||'Sin código'}</p>
                    <p><span className="font-bold">Stock actual:</span>{' '}{Number(stockProducto.stock).toLocaleString('es-AR')}</p>
                    <p><span className="font-bold">Stock mínimo:</span>{' '}{Number(stockProducto.stock_minimo).toLocaleString('es-AR')}</p>
                    <p><span className="font-bold">Estado:</span>{' '}{stockProducto.activo
                            ? 'Activo'
                            : 'Inactivo'}
                    </p>

                    {stockBajo &&
                        stockProducto.activo && (
                            <p className="text-red-500 font-bold">Este producto tiene stock bajo</p>
                        )}
                </div>
            </Card>

            <Card className="w-full max-w-3xl mx-auto mt-6">
                <h2 className="text-2xl font-bold mb-6">Movimiento de stock</h2>

                <form onSubmit={realizarMovimiento}>
                    <Label htmlFor="tipoMovimiento">Tipo de movimiento</Label>

                    <select
                        id="tipoMovimiento"
                        value={tipoMovimiento}
                        onChange={(e) =>
                            setTipoMovimiento(
                                e.target.value
                            )
                        }
                        className="bg-white border border-[#D6D3D1] rounded-md px-3 py-2 block my-2 w-full text-[#1C1917] focus:outline-none focus:border-[#13100F]"
                    >

                        <option value="entrada">Aumentar stock</option>
                        <option value="salida">Disminuir stock</option>
                    </select>

                    <Label htmlFor="cantidad">Cantidad</Label>

                    <Input
                        id="cantidad"
                        type="number"
                        step="0.001"
                        min="0.001"
                        value={cantidad}
                        onChange={(e) =>
                            setCantidad(
                                e.target.value
                            )
                        }
                    />

                    <Label htmlFor="motivo">Motivo</Label>

                    <Input
                        id="motivo"
                        type="text"
                        placeholder="Ej: Compra a proveedor"
                        value={motivo}
                        onChange={(e) =>
                            setMotivo(
                                e.target.value
                            )
                        }
                    />

                    <div className="flex justify-center mt-6">
                        <Button type="submit">
                            {tipoMovimiento === 'entrada'
                                ? 'Aumentar stock'
                                : 'Disminuir stock'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}

export default StockDetalle