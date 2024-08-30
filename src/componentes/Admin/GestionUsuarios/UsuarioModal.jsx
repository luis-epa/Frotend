import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../../config/config";

const UsuarioModal = ({ show, handleClose, usuario, departamentos, roles }) => {
  const [formData, setFormData] = useState({
    nombres: usuario.nombres,
    apellidos: usuario.apellidos,
    nickname: usuario.nickname,
    email: usuario.email,
    telefono: usuario.telefono,
    direccion: usuario.direccion,
    idDepartamento: usuario.id_departamento,
    idRol: usuario.id_rol,
  });

  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (show) {
      setFormData({
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        nickname: usuario.nickname,
        email: usuario.email,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        idDepartamento: usuario.id_departamento,
        idRol: usuario.id_rol,
      });
    }
  }, [show, usuario]);

  const filtrarDatosForm = (datos) => {
    const { nickname, email, ...filtroDatos } = datos;
    return filtroDatos;
  };

  const handleChange = (e) => {
    const camposNumericos = ["idDepartamento", "idRol"];

    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: camposNumericos.includes(name) ? Number(value) : value,
    });
  };

  const obtenerNuevosDatos = () => {
    const nuevosDatosForm = {};

    for (const key in formData) {
      if (key === "idDepartamento") {
        if (formData[key] !== usuario["id_departamento"]) {
          nuevosDatosForm[key] = formData[key];
        }
      } else if (key === "idRol") {
        if (formData[key] !== usuario["id_rol"]) {
          nuevosDatosForm[key] = formData[key];
        }
      } else {
        if (formData[key] !== usuario[key]) {
          nuevosDatosForm[key] = formData[key];
        }
      }
    }

    return nuevosDatosForm;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar el formulario
    const form = e.currentTarget;

    if (form.checkValidity()) {
      const datosForm = filtrarDatosForm(formData);

      // Verificar si hubo cambios en los valores
      const nuevosDatosForm = obtenerNuevosDatos();

      if (Object.keys(nuevosDatosForm).length === 0) {
        Swal.fire("Información", "No se realizó ningún cambio.", "info");
        return;
      }

      actualizarInfoUsuario(nuevosDatosForm);
    } else {
      e.stopPropagation();
    }

    setValidated(true);
  };

  const actualizarInfoUsuario = async (nuevosDatosForm) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/v1/admin/usuarios/${usuario.id_usuario}`,
        nuevosDatosForm,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.status === 200) {
        Swal.fire(
          "Informacón",
          "Se modificaron los datos satisfactoriamente",
          "success"
        );
      } else {
        Swal.fire(
          "Informacón",
          "No se pudo completar la operación.",
          "warning"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        "Se produjo un error al procesar la petición",
        "error"
      );
    }
  };

  return (
    show && (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group controlId="formNombres">
              <Form.Label>Nombres</Form.Label>
              <Form.Control
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Por favor, ingrese los nombres.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formApellidos">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Por favor, ingrese los apellidos.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formNickname">
              <Form.Label>Nickname</Form.Label>
              <Form.Control
                type="text"
                name="nickname"
                value={formData.nickname}
                readOnly
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                readOnly
                required
              />
            </Form.Group>
            <Form.Group controlId="formTelefono">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formDireccion">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formGridDepartamento">
              <Form.Label>Departamento</Form.Label>
              <Form.Select
                name="idDepartamento"
                value={formData.idDepartamento}
                onChange={handleChange}
                required
              >
                {departamentos.map((depto) => (
                  <option
                    key={depto.id_departamento}
                    value={depto.id_departamento}
                  >
                    {depto.nombre}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Seleccione un departamento.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formGridRol">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                value={formData.idRol}
                onChange={handleChange}
                name="idRol"
                required
              >
                {roles.map((rol) => (
                  <option key={rol.id_rol} value={rol.id_rol}>
                    {rol.nombre}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Seleccione un rol.
              </Form.Control.Feedback>
            </Form.Group>
            <div className="d-flex justify-content-center mt-3">
              <Button className="mx-2" variant="primary" type="submit">
                Guardar
              </Button>
              <Button
                className="mx-2"
                variant="secondary"
                onClick={handleClose}
              >
                Cancelar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    )
  );
};

export default UsuarioModal;
