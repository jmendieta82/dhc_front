
const CardPacienteEncontrado = ({paciente}:any) => {
  return (
    <div className='flex flex-col justify-between p-4'>
      <div className='flex flex-col items-end'>
        <span className='text-lg font-bold'>{paciente.first_name} {paciente.last_name}</span>
        <span className='font-light italic text-gray-400'>Nombre</span>
      </div>
      <div className='flex flex-col items-end'>
        <span className='text-lg font-bold'>{paciente.identificacion}</span>
        <span className='font-light italic text-gray-400'>Identificacion</span>
      </div>
      <div className='flex flex-col items-end'>
        <span className='text-lg font-bold'>{paciente.telefono}</span>
        <span className='font-light italic text-gray-400'>Telefono</span>
      </div>
      <div className='flex flex-col items-end'>
        <span className='text-lg font-bold'>{paciente.direccion}</span>
        <span className='font-light italic text-gray-400'>Direccion</span>
      </div>
    </div>
  );
};

export default CardPacienteEncontrado;