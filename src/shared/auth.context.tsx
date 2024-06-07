import {createContext, useContext, useState} from "react";

export interface Usuario{

  id?: number,
  empresa?: number,
  username?: string,
  email?: string,
  password?: string,
  first_name?: string,
  last_name?:string,
  identificacion?: string,
  tipoUsuario?: string,
  idCarpeta?: string,
  token?: string,
  especialidad?: string,
  created_at?:number,
  updated_at?:string

}

export const authContext = createContext(
  {
    user: {} as Usuario | null,
    role: '',
    saveUser: (_: any) => {},
    saveRole: (_: any) => {} ,
  }
)

export const useAuth = () =>{
  const context = useContext(authContext)
  if(!context) throw new Error("No User")
  return context
}

export function AuthProvider ({children}:any) {
  const usr = window.localStorage.getItem('user')
  const rl = window.localStorage.getItem('role')
  const usuario = usr ? JSON.parse(usr) as Usuario : null;
  const rol = rl?rl:'';


  const [user,setUser] = useState(usuario)
  const [role,setRole] = useState(rol)




  const saveUser = (user:any) => {
    setUser(user)
    window.localStorage.setItem('user', JSON.stringify(user))
  }

  const saveRole = (role:any) => {
    setRole(role)
    window.localStorage.setItem('role', role)
  }

  return (
    <authContext.Provider value={{user,saveUser,role,saveRole}}>
      {children}
    </authContext.Provider>
  );
};