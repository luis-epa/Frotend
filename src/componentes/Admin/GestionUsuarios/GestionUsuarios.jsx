import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import UsuarioModal from "./UsuarioModal";
import Swal from "sweetalert2";
import apiAuth from "../../../api/apiAuth";
import { API_BASE_URL } from "../../../config/config";

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      const apiUsuarios = axios.create({
        baseURL: `${API_BASE_URL}/api/v1`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      try {
        const [resUsuarios, resDepartamentos, resRoles] = await Promise.all([
          apiUsuarios.get("/admin/usuarios"),
          apiUsuarios.get("/departamentos"),
          apiUsuarios.get("/roles"),
        ]);

        setUsuarios(resUsuarios.data.usuarios);
        setDepartamentos(resDepartamentos.data.departamentos);
        setRoles(resRoles.data.roles);
      } catch (error) {
        setError("Error al obtener los datos.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    obtenerDatos();
  }, []);

  const handleShow = (usuario) => {
    setSelectedUsuario(usuario);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleViewEdit = (usuario) => {
    handleShow(usuario);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRecord(id);
      }
    });
  };

  const deleteRecord = async (id) => {
    if (id && id > 0) {
      const apiUsuarios = axios.create({
        baseURL: `${API_BASE_URL}/api/v1`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      try {
        const res = await apiUsuarios.delete(`/admin/usuarios/${id}`);

        if (res.status === 204)
          Swal.fire(
            "Información",
            "Se eliminó el registro satisfactoriamente.",
            "success"
          );

        setUsuarios(usuarios.filter((usuario) => usuario.id_usuario !== id));
      } catch (error) {
        Swal.fire(
          "Error",
          "Se produjo un error al procesar la petición.",
          "error"
        );
      }
    }
  };

  return (
    <div className="mt-4" style={{ width: "90%", margin: "0 auto" }}>
      <Table
        striped
        bordered
        hover
        className="table-bordered border-secondary rounded"
      >
        <thead>
          <tr>
            <th className="text-center">Id</th>
            <th className="text-center">Nombres</th>
            <th className="text-center">Apellidos</th>
            <th className="text-center">Nickname</th>
            <th className="text-center">Correo</th>
            <th className="text-center">Activo</th>
            <th className="text-center">Verificado</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id_usuario}>
              <td className="text-center">{usuario.id_usuario}</td>
              <td className="text-center">{usuario.nombres}</td>
              <td className="text-center">{usuario.apellidos}</td>
              <td className="text-center">{usuario.nickname}</td>
              <td className="text-center">{usuario.email}</td>
              <td className="text-center">
                {usuario.activo.data == 1 ? "Sí" : "No"}
              </td>
              <td className="text-center">
                {usuario.verificado.data == 1 ? "Sí" : "No"}
              </td>
              <td className="text-center">
                <Button variant="info" onClick={() => handleViewEdit(usuario)}>
                  Ver/Editar
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDelete(usuario.id_usuario)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Mostrar ventana modal de edición */}

      {selectedUsuario && (
        <UsuarioModal
          show={showModal}
          handleClose={handleClose}
          usuario={selectedUsuario}
          departamentos={departamentos}
          roles={roles}
        ></UsuarioModal>
      )}
    </div>
  );
};

export default GestionUsuarios;
