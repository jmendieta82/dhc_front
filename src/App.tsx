import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import PageHome from "./pages/PageHome.tsx";
import PageGestionPersonas from "./pages/PageGestionPersonas.tsx";
import PageGestionDocumentos from "./pages/PageGestionDocumentos.tsx";
import PageLogin from "./pages/PageLogin.tsx";
import {ProtectedRoute} from "./shared/ProtectedRoute.tsx";
import PageAccesoDenegado from "./pages/PageAccesoDenegado.tsx";
import {AuthProvider} from "./shared/auth.context.tsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<PageLogin />} />
          <Route path="/" element={<PageHome />} />
          <Route path="/acceso-denegado" element={<PageAccesoDenegado />} />
          <Route  path="/personas" element={<ProtectedRoute rol={["Administrador"]}><PageGestionPersonas /></ProtectedRoute>} />
          <Route  path="/documentos" element={<ProtectedRoute rol={["Administrador"]}><PageGestionDocumentos /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
