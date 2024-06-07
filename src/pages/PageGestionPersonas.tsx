import Layout from "../components/Layout.tsx";
import {Card, CardBody, Tab, Tabs} from "@nextui-org/react";
import Gestor from "../components/Gestor.tsx";
import Paciente from "../components/Paciente.tsx";
import Medico from "../components/Medico.tsx";




const PageGestionPersonas = () => {
  return (
    <Layout>
      <Tabs aria-label="Options">
        <Tab key="gestor" title="Gestor">
          <Card>
            <CardBody>
              <Gestor/>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="paciente" title="Pacientes">
          <Card>
            <CardBody>
              <Paciente/>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="medicos" title="Médicos">
          <Card>
            <CardBody>
             <Medico/>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </Layout>
  );
};

export default PageGestionPersonas;