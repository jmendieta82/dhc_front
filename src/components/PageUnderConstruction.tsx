
import { FaTools } from 'react-icons/fa';

const PageUnderConstruction = () => (
  <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100">
    <FaTools className="text-blue-500 text-6xl mb-6 animate-spin" />
    <h1 className="text-blue-500 text-4xl mb-2">Página en construcción</h1>
    <p className="text-blue-500 text-2xl">Lamentamos los inconvenientes, estamos trabajando para brindarte una mejor experiencia.</p>
  </div>
);

export default PageUnderConstruction;