import Layout from "../components/Layout.tsx";
import {Button, Card, CardBody, CardHeader, Input} from "@nextui-org/react";
import {useForm} from "react-hook-form";
import {post} from "../shared/api.tsx";
import {useAuth} from "../shared/auth.context.tsx";
import {useNavigate} from "react-router-dom";

const PageLogin = () => {
  const {register,handleSubmit} = useForm()
  const {saveUser,saveRole} = useAuth()
  const navigate = useNavigate();

  const submit = async (data:any) => {
    try {
      const request = await post('/token',data)
      saveUser(request)
      saveRole(request.tipoUsuario)
      console.log(request)
      navigate('/')
    }catch(error){
      console.log(error)
    }
  };
  return (
    <Layout>
      <div className='w-full h-screen flex justify-center items-center'>
        <Card className='w-1/3 h-1/3'>
          <CardHeader className='flex flex-col gap-4'>
              <span className='font-bold text-xl'>DHCLINIC24</span>
              <span className='font-light'>Inicio de sesion</span>
          </CardHeader>
          <CardBody className='p-4'>
            <form onSubmit={handleSubmit(submit)} className='flex flex-col gap-4'>
              <Input type="text" label="Nombre de usuario" {...register('username')}/>
              <Input type="password" label="Contraseña" {...register('password')}/>
              <Button type='submit' color='primary'>Ingresar</Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default PageLogin;