import {Button, Card, CardBody, Divider, Input, Tab, Tabs, Textarea} from "@nextui-org/react";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import {get, post} from "../shared/api.tsx";
import {useEffect, useState} from "react";
import {SiGoogledocs} from "react-icons/si";
import {RxUpdate} from "react-icons/rx";
import CardFileInfo from "./CardFileInfo.tsx";
import {FaPlus} from "react-icons/fa";
import { Dialog } from 'primereact/dialog';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import {useAuth} from "../shared/auth.context.tsx";
import CustomSpinner from "./CustomSpinner.tsx";
import CardPacienteEncontrado from "./CardPacienteEncontrado.tsx";
import {LuFilePlus} from "react-icons/lu";
import {TbFolderCancel} from "react-icons/tb";
import {VscFolderActive} from "react-icons/vsc";
import { FileUpload } from 'primereact/fileupload';
import {postUpload} from "../shared/UploadApi.tsx";
import {useForm} from "react-hook-form";

const ExploradorDocumentos = () => {
  const {user}= useAuth()
  const {handleSubmit} =useForm()
  const [searchValue, setInputValue] = useState('');
  const [paciente, setPaciente] = useState<any>('');
  const [commit,setCommit] = useState('')
  const [files,setFiles] = useState([])
  const [fileInfo,setFileInfo] = useState<any>()
  const [loading, setLoading] = useState(false);
  const [loadingFileInfo, setLoadingFileInfo] = useState(false);
  const [loadingFileUpload, setLoadingFileUpload] = useState(false);
  const [loadingFileCommit, setLoadingFileCommit] = useState(false);
  const [loadingSaveCommit, setLoadingSaveCommit] = useState(false);
  const [loadingPaciente, setLoadingPaciente] = useState(false);
  const [loadingDir, setLoadingDir] = useState(false);
  const [selected, setSelected] = useState("documentos");
  const [selectedFile, setSelectedFile] = useState<any>();
  const [commits, setCommits] = useState<any>([]);
  const [commitsDialog, setCommitsDialog] = useState<any>(false);
  const [filesDialog, setFilesDialog] = useState<any>(false);


  const getFiles = async () => {
    setFiles([])
    if(paciente && paciente.idCarpeta){
      setLoading(true)
      try{
        const response = await post('ver_archivo',{'folder_id':paciente.idCarpeta})
        setFiles(response.files)
        setLoading(false)
        console.log(response.files)
      }catch (e){
        console.error(e);
        setLoading(false)
      }
    }
  };
  const getCommits = async (file_id:string) =>{
    setLoadingFileCommit(true)
    try{
      const response = await get('commit/?file_id='+file_id)
      setCommits(response)
      setLoadingFileCommit(false)
    }catch(error){
      setLoadingFileCommit(false)
      console.error(error)
    }
  }
  const selectFile = async (file:any) =>{
    setLoadingFileInfo(true)
    setSelected('commits')
    try{
      const response = await post('get_file_info',{'file_id':file.id})
      setFileInfo(response.file_info)
      getCommits(file.id)
      setLoadingFileInfo(false)
      setSelectedFile(file)
    }catch(error){
      setLoadingFileInfo(false)
      console.error(error)
    }
  }
  const saveCommit = async () =>{
    setLoadingSaveCommit(true)
    if(selectedFile){
      let obj = {
        'file_id':selectedFile.id,
        'commit':commit,
        'usuario_id':user?.id,
        'parent_id':0
      }
      try{
        await post('commit/',obj)
        setLoadingSaveCommit(false)
        setCommitsDialog(false)
        getCommits(selectedFile.id)
      }catch(error){
        setLoadingSaveCommit(false)
        console.error(error)
      }
    }else {
      alert("No hay archivos para comentar.")
    }
  }
  const formatearFecha = (fecha: string) => {
    const opciones: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' , hour: 'numeric', minute: 'numeric' };
    const fechaFormateada = new Intl.DateTimeFormat('es-ES', opciones).format(new Date(fecha));

    return fechaFormateada;
  }
  const getPaciente = async () => {
    if(searchValue){
      setLoadingPaciente(true)
      try{
        const response = await get('/perosna_by_id/?cedula='+searchValue)
        setLoadingPaciente(false)
        setPaciente(response[0])
        console.log(response)
      }catch (e){
        setLoadingPaciente(false)
        console.log(e);
      }
    }else {
      alert('Debe incluir un numero de identificacion para la busqueda')
    }
  }
  const clearControl = ()=>{
    setInputValue('')
    setPaciente('')
  }
  const createDir = async () =>{
    if(paciente && !paciente.idCarpeta){
      setLoadingDir(true)
      let obj = {
        'dir_name':paciente.identificacion,
        'parent_folder_id':'',
        'paciente_id':paciente.id,
      }
      console.log(obj)
      try{
        const response = await post('crear_carpeta',obj)
        getPaciente()
        console.log(response)
        setLoadingDir(false)
      }catch (err){
        console.log(err)
        setLoadingDir(false)
      }
    }else {
      alert('Este paciente ya cuenta con una carpeta.')
    }
  }
  const submitFile = async ({files}:any) => {
    setLoadingFileUpload(true)
    try{
      // Crear un objeto FormData y agregar el archivo
      const formData = new FormData();
      for(let file of files){
        formData.append('file_content', file,file.name);
        formData.append('file_name', file.name);
        formData.append('folder_id', paciente.idCarpeta);
      }
      // Enviar el archivo al servidor
      await postUpload("/subir_archivo", formData)
      getFiles()
      setFilesDialog(false)
      setLoadingFileUpload(false)
    }catch(error){
      setLoadingFileUpload(false)
      console.error(error)
    }

  }
  useEffect(() => {
    getFiles()
  }, [paciente]);

  return (
    <>
    <Dialog header="Crear comentario" visible={commitsDialog} style={{width: '35vw'}} onHide={() => {
      if (!commitsDialog) return;
      setCommitsDialog(false);
    }}>
      <form onSubmit={handleSubmit(saveCommit)} className='flex flex-col gap-6'>
        <Textarea
          label="Comentario"
          placeholder="Escriba su comentario"
          className="w-full"
          value={commit}
          onChange={e => setCommit(e.target.value)}
        />
        <div className='flex justify-end'>
          <Button type='submit' color='primary' isLoading={loadingSaveCommit}>Guardar</Button>
        </div>
      </form>
    </Dialog>
    <Dialog header="Subir archivo" visible={filesDialog} style={{width: '35vw'}} onHide={() => {
      if (!filesDialog) return;
      setFilesDialog(false);
    }}>

      <FileUpload name="demo[]" multiple accept="pdf/*" maxFileSize={10000000} chooseLabel='Seleccionar'
                  uploadLabel='Cargar' cancelLabel='Cancelar' customUpload uploadHandler={submitFile}
                  emptyTemplate={<p className="m-0">Suelte aui el archivo que desea subir</p>} />

      {
        loadingFileUpload &&(
          <CustomSpinner message='Subiendo archivo.'/>
        )
      }
    </Dialog>
    <div className='w-full flex justify-end items-center gap-4'>
      <Input
        isClearable
        color='primary'
        className='w-1/5'
        type="text"
        label="Buscar paciente"
        value={searchValue}
        onClear={clearControl}
        onChange={e => setInputValue(e.target.value)}
      />
      <Button onClick={getPaciente} color='primary' isLoading={loadingPaciente}>Buscar</Button>
    </div>
    {paciente && (
      <div className='mt-10 grid flex gap-4'>
        <Card>
          <CardBody>
            <Tabs aria-label="Options" selectedKey={selected} onSelectionChange={setSelected}>
              <Tab key="paciente" title="Paciente">
                <CardPacienteEncontrado paciente={paciente}/>
              </Tab>
              <Tab key="documentos" title="Documentos">
                <div className='flex justify-between gap-4 mt-7'>
                  <Button onClick={createDir} isLoading={loadingDir}
                          color={(paciente && !paciente.idCarpeta)?'danger':'success'}>
                    {
                      (paciente && !paciente.idCarpeta)?
                        <div className='flex flex-row gap-4'><TbFolderCancel className='text-lg'/> Crear carpeta</div>
                        :<div className='flex flex-row gap-4'><VscFolderActive className='text-lg'/> /{paciente.identificacion}</div>
                    }
                  </Button>
                  {
                    (paciente && paciente.idCarpeta)&& (
                      <div className='flex flex-row gap-4'>
                        <Button onClick={() => setFilesDialog(true)} isIconOnly color='primary'><LuFilePlus
                          className='text-lg'/></Button>
                        <Button onClick={getFiles} isIconOnly color='primary'><RxUpdate className='text-lg'/></Button>
                      </div>
                    )
                  }
                </div>
                {
                  loading ? <CustomSpinner message='Consultando archivos del paciente'/> :
                    <div className='flex justify-start mt-10'>
                      {
                        files.map((file: any) => (
                          <div key={file.id} onClick={() => selectFile(file)}
                               className='flex items-center flex-col justify-start gap-2 cursor-pointer p-5'>
                            <SiGoogledocs className='text-5xl text-blue-500'/>
                            <span>{file.name}</span>
                          </div>
                        ))
                      }
                    </div>
                }
              </Tab>
              <Tab key="commits" title="Informacion de archivo">
                <div className='flex justify-start mt-7'>
                  <Button onClick={() => setCommitsDialog(true)} color='primary'><FaPlus/> Nuevo comentario</Button>
                </div>
                {
                  loadingFileCommit ? <CustomSpinner message='Consultando comentarios'/>
                    : <div className='grid grid-cols-4'>
                      <div className='flex flex-col gap-6 mt-10 p-4 rounded-lg col-span-3'>
                        {
                          commits.map((message: any) => (
                            <div key={message.id} className='flex flex-col gap-6'>
                              <div className='flex flex-col'>
                                  <span
                                    className='font-bold text-lg'>{message.usuario.first_name} {message.usuario.last_name}</span>
                                <span className='font-light italic'>{formatearFecha(message.created_at)}</span>
                              </div>
                              <span>{message.commit}</span>
                              <Divider/>
                            </div>
                          ))
                        }
                      </div>
                      {loadingFileInfo ? <CustomSpinner message='Consultando informacion del archivo'/> : fileInfo &&
                          <CardFileInfo fileInfo={fileInfo}/>}
                    </div>
                }
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    )}
</>
)
  ;
};

export default ExploradorDocumentos;