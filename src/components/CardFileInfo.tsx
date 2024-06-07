
const CardFileInfo = ({fileInfo}:any) => {

  const formatearFecha = (fecha: string) => {
    const opciones: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' , hour: 'numeric', minute: 'numeric' };
    const fechaFormateada = new Intl.DateTimeFormat('es-ES', opciones).format(new Date(fecha));

    return fechaFormateada;
  }

  return (
    <div className='p-6'>
      {
        fileInfo &&(
          <>
            <div className='flex flex-col items-end'>
              <span className='text-lg font-bold'>{formatearFecha(fileInfo.createdTime)}</span>
              <span className='text-gray-400 font-light italic'>Creacion</span>
            </div>
            <div className='flex flex-col items-end'>
              <span className='text-lg font-bold'>{formatearFecha(fileInfo.modifiedTime)}</span>
              <span className='text-gray-400 font-light italic'>Modificacion</span>
            </div>
            <div className='flex flex-col items-end'>
              <span className='text-lg font-bold'>{fileInfo.name}</span>
              <span className='text-gray-400 font-light italic'>Nombre</span>
            </div>
            <div className='flex flex-col items-end'>
              <span className='text-lg font-bold'>{(fileInfo.size / (1024 * 1024)).toFixed(2)} Mb</span>
              <span className='text-gray-400 font-light italic'>Tamaño</span>
            </div>

          </>
        )
      }
    </div>
  );
};

export default CardFileInfo;