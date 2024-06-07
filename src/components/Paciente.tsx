import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {get, post, put} from "../shared/api.tsx";
import {Button, Input} from "@nextui-org/react";
import {FaPlusCircle} from "react-icons/fa";
import {FaPencil} from "react-icons/fa6";
import {Dialog} from "primereact/dialog";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";

const Paciente = () => {
  const [pacientes,setPacientes] = useState<any>([])
  const [formDialogPacinete, setFormDialogPacinete] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<any>({});
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
      if(selectedPaciente && selectedPaciente.id){
        data.empresa_id = null
        data.tipoUsuario = selectedPaciente.tipoUsuario
        request = await put('persona/'+selectedPaciente.id+'/',data)
      }else {
        data.tipoUsuario = 'Paciente'
        data.empresa_id = null
        data.idCarpeta = ''
        data.username = data.identificacion
        data.password = 'CC'+data.identificacion
        request = await post('persona/',data)
      }
      console.log(request)
      setLoading(false)
      clearForm()
      getPacientes()
    }catch(error){
      setLoading(false)
      console.log(error)
    }
  }

  const clearForm = () =>{
    reset();
    setSelectedPaciente('')
    setFormDialogPacinete(false)
  }
  const getPacientes = async () => {
    setLoading(true)
    try{
      const response = await get("/personabytipo/?tipoUsuario=Paciente");
      setPacientes(response)
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
  }

  const selectPaciente= (rowData:any) =>{
    console.log(rowData)
    setSelectedPaciente(rowData)
    setFormDialogPacinete(true)
  }

  const headerPaciente = (
    <div className="flex justify-end">
      <Button color='primary' isIconOnly onClick={()=>{clearForm();setFormDialogPacinete(true)}}><FaPlusCircle/></Button>
    </div>
  );
  const bodyActions = (rowData:any) =>{
    return <FaPencil onClick={()=>selectPaciente(rowData)} className="cursor-pointer"/>
  }

  useEffect(() => {
    fillForm(selectedPaciente)
  }, [selectedPaciente]);

  useEffect(() => {
    getPacientes()
  }, []);

  return (
    <div>
      <Dialog header="Header" visible={formDialogPacinete} style={{width: '50vw'}} onHide={() => {
        if (!formDialogPacinete) return;
        setFormDialogPacinete(false);
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
            </div>
          </div>
          <div className='flex justify-end p-4 gap-4'>
            <Button type="submit" color="primary" isLoading={loading}>Guardar</Button>
            <Button color="secondary" onClick={clearForm}>Cancelar</Button>
          </div>
        </form>
      </Dialog>
      <DataTable value={pacientes} tableStyle={{minWidth: '50rem'}} header={headerPaciente} size={'small'}
                 showGridlines stripedRows paginator rows={10} rowsPerPageOptions={[10, 25, 50]} loading={loading}
                 emptyMessage='No se encontraron Pacientes'>
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

export default Paciente;