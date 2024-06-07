import {Button} from "@nextui-org/react";
import {useNavigate} from "react-router-dom";
import Layout from "../components/Layout.tsx";


const PageAccesoDenegado = () => {
  const navigate = useNavigate();
  const navigateToPage = () => {
    navigate('login')
  }
  return (
    <Layout>
        Acceso denegado
        <Button onClick={navigateToPage}>Regresar</Button>
    </Layout>
  );
};

export default PageAccesoDenegado;