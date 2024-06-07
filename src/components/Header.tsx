import {
  Avatar,
  Dropdown, DropdownItem, DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
} from "@nextui-org/react";
import {FaGoogleDrive, FaUserAstronaut, FaUsers} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../shared/auth.context.tsx";
import {IoMdHome} from "react-icons/io";
import {IoDocumentsOutline} from "react-icons/io5";
import {CiLogout} from "react-icons/ci";
import {post} from "../shared/api.tsx";


const Header = () => {
  const navigate = useNavigate();
  const {saveUser,saveRole} = useAuth()
  const navigateTo = (path:string) =>{
    navigate(path);
  }
  const salir = () =>{
    window.localStorage.removeItem('user')
    window.localStorage.removeItem('role')
    saveUser(null)
    saveRole(null)
    navigate('/login');
  }
  const updateConection = async () => {
    try{
      await post('renew_google_connection',{})
    }catch(e){
      console.log(e)
    }
  };
  return (
    <Navbar className='p-4 bg-blue-950'>
      <NavbarBrand className='text-white'>
        <p className="font-bold text-inherit">DHCLINIC24</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
      </NavbarContent>
      <NavbarContent justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              showFallback
              color="primary"
              fallback={
                <FaUserAstronaut className="animate-pulse w-7 h-7 text-white" fill="currentColor"/>
              }
              size="lg"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem textValue='avatar' key="avatar" className="p-4">
              <p className="font-semibold text-medium">Javier Mendieta</p>
              <p className="font-light">Bienveni@</p>
            </DropdownItem>

            <DropdownItem textValue='inicio' onClick={() => navigateTo('/')} key="inicio" startContent={<IoMdHome />}>Inicio</DropdownItem>
            <DropdownItem textValue='persona' onClick={() => navigateTo('/personas')} key="persona" startContent={<FaUsers />}>Personas</DropdownItem>
            <DropdownItem textValue='documentos' onClick={() => navigateTo('/documentos')} key="documentos" startContent={<IoDocumentsOutline />}>Documentos</DropdownItem>
            <DropdownItem textValue='ajustes' onClick={updateConection} key="ajustes" startContent={<FaGoogleDrive />}>Actualizr conexion</DropdownItem>
            <DropdownItem textValue='salir' onClick={salir} key="salir" color="danger" startContent={<CiLogout/>}>Salir</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
};

export default Header;