import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./Routes/ProtectedRoute";
import LoginPage from "./pages/public/LoginPage";
import RegistroPage from "./pages/public/RegistroPage";
import NavBarComponent from "./componentes/Navigation/NavBar";
import CrearJuego from "./componentes/CrearJuego";
import Catalogo from "./componentes/Catalogo";
import NuevoUsuarioPage from "./pages/admin/NuevoUsuarioPage";
import GestionUsuariosPage from "./pages/admin/GestionUsuariosPage";

function App() {
  return (
    <div className="">
      <AuthProvider>
        <NavBarComponent></NavBarComponent>
        <Routes>
          {/* Catálogo */}
          <Route exact path="/" element={<Catalogo />} />
          <Route exact path="/catalogo" element={<Catalogo />} />

          {/* Login */}
          <Route path="/autenticacion/inicioSesion" element={<LoginPage />} />

          {/* Registro */}
          <Route path="/autenticacion/registro" element={<RegistroPage />} />

          {/* Juegos */}
          <Route path="/admin/catalogo/crearJuego" element={<CrearJuego />} />

          {/* Usuarios */}
          <Route
            path="/admin/usuarios/nuevoUsuario"
            element={
              <ProtectedRoute requiredRole="Administrador">
                <NuevoUsuarioPage />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/admin/usuarios/gestionUsuarios"
            element={
              <ProtectedRoute requiredRole="Administrador">
                <GestionUsuariosPage />
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
