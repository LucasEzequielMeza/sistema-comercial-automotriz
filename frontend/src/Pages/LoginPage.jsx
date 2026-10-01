import React from 'react'
import Card from "../Components/UI/Card"
import Input from "../Components/UI/Input"
import Button from '../Components/UI/Button';
import Label from '../Components/UI/Label';
import {Link, useNavigate} from "react-router-dom"
import {useForm} from "react-hook-form"
import { useAuth } from '../Context/ContextoAutorizacion.jsx';

function LoginPage() {

  const {login, erroresBackEnd} = useAuth();
  const navigate = useNavigate();
  const {register, handleSubmit} = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const usuario = await login(data)
    if (usuario) {
      navigate("/productos")
    }
  })



  return (

    <div className='h-[calc(100vh-8rem)] flex items-center justify-center'>
      <Card>
        <h1 className='text-2xl font-bold text-white flex items-center justify-center'>Iniciar Sesión</h1>
        {erroresBackEnd?.length > 0 && (
          <div className="mt-4 mb-4 rounded-md bg-red-500/10 border border-red-500 p-3">
            {erroresBackEnd.map((error, index) => (
              <p key={index} className="text-red-500 text-sm text-center">
                {error}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <Label htmlFor='usuario'>Usuario</Label>
          <Input type='text' placeholder='Ingrese su usuario' {...register('usuario', {required: true})} />
          <Label htmlFor='contrasena'>Contraseña</Label>
          <Input type='password' placeholder='Ingrese su contraseña' {...register('contrasena', {required: true})} />
          <div className="flex justify-center mt-4">
            <Button type="submit">
              Iniciar sesion
            </Button>
          </div>
        </form>
        <div className='flex justify-between my-4'>
          <p className='text-center text-gray-400'>
            ¿No tienes una cuenta? <Link className='font-bold' to='/registro'>Regístrate aquí</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default LoginPage