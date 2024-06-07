import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {get, post, put} from "../shared/api.tsx";
import {Button, Input, Select, SelectItem} from "@nextui-org/react";
import {FaPlusCircle} from "react-icons/fa";
import {FaPencil} from "react-icons/fa6";
import {Dialog} from "primereact/dialog";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";

const Medico = () => {
  const [medicos,setMedicos] = useState<any>([])
  const [formMedicoDialog, setFormMedicoDialog] = useState(false);
  const [selectedMedico, setSelectedMedico] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset
  } = useForm()

  const especialidades = [
    {key: "general", label: "Medicina general"},
    {key: "endocrinologia", label: "Endocrinologia"},
    {key: "traumatologia", label: "Traumatologia"},
    {key: "odontologia", label: "Odontologia"},
    {key: "cirujia", label: "Cirujia"},
  ];

  const submit = async (data:any) =>{
    setLoading(true)
    try{
      let request =''
      if(selectedMedico && selectedMedico.id){
        data.empresa_id = null
        data.tipoUsuario = selectedMedico.tipoUsuario
        request = await put('persona/'+selectedMedico.id+'/',data)
      }else {
        data.tipoUsuario = 'Medico'
        data.empresa_id = null
        data.idCarpeta = ''
        data.username = data.identificacion
        data.password = 'CC'+data.identificacion
        request = await post('persona/',data)
      }
      console.log(request)
      setLoading(false)
      clearForm()
      getMedicos()
    }catch(error){
      setLoading(false)
      console.log(error)
    }
  }

  const clearForm = () =>{
    reset();
    setSelectedMedico('')
    setFormMedicoDialog(false)
  }
  const getMedicos = async () => {
    setLoading(true)
    try{
      const response = await get("/personabytipo/?tipoUsuario=Medico");
      setMedicos(response)
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
    setValue('especialidad',data.especialidad)
  }

  const selectUser= (rowData:any) =>{
    console.log(rowData)
    setSelectedMedico(rowData)
    setFormMedicoDialog(true)
  }

  const headerMedico = (
    <div className="flex justify-end">
      <Button color='primary' isIconOnly onClick={()=>{clearForm();setFormMedicoDialog(true)}}><FaPlusCircle/></Button>
    </div>
  );
  const bodyActions = (rowData:any) =>{
    return <FaPencil onClick={()=>selectUser(rowData)} className="cursor-pointer"/>
  }

  useEffect(() => {
    fillForm(selectedMedico)
  }, [selectedMedico]);

  useEffect(() => {
    getMedicos()
  }, []);

  return (
    <div>
      <Dialog header="Header" visible={formMedicoDialog} style={{width: '50vw'}} onHide={() => {
        if (!formMedicoDialog) return;
        setFormMedicoDialog(false);
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
                <Select
                  label="Especialidad"
                  {...register('especialidad')}
                >
                  {especialidades.map((especialidad) => (
                    <SelectItem key={especialidad.key}>
                      {especialidad.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </div>
          <div className='flex justify-end p-4 gap-4'>
            <Button type="submit" color="primary" isLoading={loading}>Guardar</Button>
            <Button color="secondary" onClick={clearForm}>Cancelar</Button>
          </div>
        </form>
      </Dialog>
      <DataTable value={medicos} tableStyle={{minWidth: '50rem'}} header={headerMedico} size={'small'}
                 showGridlines stripedRows paginator rows={10} rowsPerPageOptions={[10, 25, 50]} loading={loading}
                 emptyMessage='No se encontraron Medicos'>
        <Column field="first_name" header="Nombres"></Column>
        <Column field="last_name" header="Apellidos"></Column>
        <Column field="identificacion" header="Identificacion"></Column>
        <Column field="telefono" header="Teléfono"></Column>
        <Column field="direccion" header="Direccion"></Column>
        <Column field="especialidad" header="Especialidad"></Column>
        <Column body={bodyActions}></Column>
      </DataTable>
    </div>
  );
};

export default Medico;