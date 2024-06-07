import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {get, post, put} from "../shared/api.tsx";
import {Button, Input} from "@nextui-org/react";
import {FaPlusCircle} from "react-icons/fa";
import {useEffect, useState} from "react";
import {Dialog} from "primereact/dialog";
import {FaPencil} from "react-icons/fa6";
import {useForm} from "react-hook-form";

const Gestor = () => {
  const [usuarios,setUsuarios] = useState<any>([])
  const [formGestorDialog, setFormGestorDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset
  } = useForm()

  const submit = async (data:any) =>{
    setLoading(true)
    try{
      let request =''
      if(selectedUser && selectedUser.id){
        data.empresa_id = null
        data.tipoUsuario = selectedUser.tipoUsuario
        request = await put('persona/'+selectedUser.id+'/',data)
      }else {
        data.tipoUsuario = 'Gestor'
        data.empresa_id = null
        data.idCarpeta = ''
        request = await post('persona/',data)
      }
      console.log(request)
      setLoading(false)
      clearForm()
      getUsuarios()
    }catch(error){
      setLoading(false)
      console.log(error)
    }
  }

  const clearForm = () =>{
    reset();
    setSelectedUser('')
    setFormGestorDialog(false)
  }
  const getUsuarios = async () => {
    setLoading(true)
    try{
      const respponse = await get("/personabytipo/?tipoUsuario=Gestor");
      setUsuarios(respponse)
      setLoading(false)
    }catch(error){
      console.log(error)
      setLoading(false)
    }
  }

  const fillForm = (data:any) =>{
    setValue('identificacion',data.identificacion)
    setValue('direccion',data.direccion)
    setValue('first_name',data.first_name)
    setValue('last_name',data.last_name)
    setValue('email',data.email)
    setValue('telefono',data.telefono)
    setValue('username',data.username)
    setValue('password',data.password)
  }

  const selectUser= (rowData:any) =>{
    console.log(rowData)
    setSelectedUser(rowData)
    setFormGestorDialog(true)
  }

  const headeGestor = (
    <div className="flex justify-end">
      <Button color='primary' isIconOnly onClick={()=>{clearForm();setFormGestorDialog(true)}}><FaPlusCircle/></Button>
    </div>
  );
  const bodyActions = (rowData:any) =>{
    return <FaPencil onClick={()=>selectUser(rowData)} className="cursor-pointer"/>
  }

  useEffect(() => {
    fillForm(selectedUser)
  }, [selectedUser]);

  useEffect(() => {
    getUsuarios()
  }, []);

  return (
    <div>
      <Dialog header="Header" visible={formGestorDialog} style={{width: '50vw'}} onHide={() => {
        if (!formGestorDialog) return;
        setFormGestorDialog(false);
      }}>
        <form onSubmit={handleSubmit(submit)}>
          <div className='flex justify-between gap-4'>
            <div className='w-full flex flex-col gap-4'>
              <div className='flex justify-between gap-4'>
                <Input type="text" label="Identificacion"{...register('identificacion')}/>
                <Input type="text" label='Direccion'  {...register('direccion')}/>
              </div>
              <div className='flex justify-between gap-4'>
                <Input type="text" label="Nombres" {...register('first_name')}/>
                <Input type="text" label="Apellidos" {...register('last_name')}/>
              </div>
              <div className='flex justify-between gap-4'>
                <Input type="text" label="Email" {...register('email')}/>
                <Input type="text" label="Telefono" {...register('telefono')}/>
              </div>
              <div className='flex justify-between gap-4'>
                <Input type="text" label="Nombre de usuario" {...register('username')}/>
                {
                  !selectedUser.id &&(
                    <Input type="password" label="Contraseña" {...register('password')}/>
                  )
                }
              </div>
            </div>
          </div>
          <div className='flex justify-end p-4 gap-4'>
            <Button type="submit" color="primary" isLoading={loading}>Guardar</Button>
            <Button color="secondary" onClick={clearForm}>Cancelar</Button>
          </div>
        </form>
      </Dialog>
      <DataTable value={usuarios} tableStyle={{minWidth: '50rem'}} header={headeGestor} size={'small'}
                 showGridlines stripedRows paginator rows={10} rowsPerPageOptions={[10, 25, 50]} loading={loading}
                 emptyMessage='No se encontraron Gestores'>
        <Column field="first_name" header="Nombres"></Column>
        <Column field="last_name" header="Apellidos"></Column>
        <Column field="identificacion" header="Identificacion"></Column>
        <Column field="telefono" header="Teléfono"></Column>
        <Column field="direccion" header="Direccion"></Column>
        <Column body={bodyActions}></Column>
      </DataTable>
    </div>
  );
};

export default Gestor;