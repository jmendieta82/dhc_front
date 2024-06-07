import { Navigate } from 'react-router-dom'
import {useAuth} from "./auth.context.tsx";

export function ProtectedRoute({rol,children}:any) {
  const {user,role} = useAuth()

  if(!user) return <Navigate to="/login" />

  const index = rol.findIndex((item:any) => item.includes(role))


  if(rol && index == -1){
    return <Navigate to="/acceso-denegado" replace />
  }
  return (
    <>{children}</>
  )
}