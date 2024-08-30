import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "./Registro.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../config/config";

function RegistroForm() {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    nickname: "",
    email: "",
    clave: "",
    claveCon: "",
    telefono: "",
    direccion: "",
    idDepartamento: 0,
  });

  const [departamentos, setDepartamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const obtenerDatos = async () => {
      const api = axios.create({
        baseURL: `${API_BASE_URL}/api/v1`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      try {
        const [resDepartamentos] = await Promise.all([
          api.get("/departamentos"),
        ]);

        setDepartamentos(resDepartamentos.data.departamentos);
      } catch (error) {
        setError("Error al obtener los datos.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    obtenerDatos();
  }, []);

  useEffect(() => {
    setDefaultValuesDropdonwList();
  }, [isLoading, departamentos]);

  const setDefaultValuesDropdonwList = () => {
    if (!isLoading && departamentos.length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        idDepartamento: departamentos[0].id_departamento,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`name: ${name}, value: ${value}`);
    const camposNumericos = ["idDepartamento"];

    setFormData({
      ...formData,
      [name]: camposNumericos.includes(name) ? Number(value) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar el formulario
    const form = e.currentTarget;

    if (form.checkValidity()) {
      registro();
    } else {
      e.stopPropagation();
    }

    setValidated(true);
  };

  const cleanForm = () => {
    setFormData({
      nombres: "",
      apellidos: "",
      nickname: "",
      email: "",
      clave: "",
      claveCon: "",
      telefono: "",
      direccion: "",
    });
    setDefaultValuesDropdonwList();

    setValidated(false);
  };

  const registro = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/autenticacion/registro`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.status === 201)
        Swal.fire(
          "Información",
          "Su cuenta ha sido creada. Se ha enviado un enlace de verificación a su correo.",
          "success"
        );

      cleanForm();
    } catch (error) {
      Swal.fire(
        "Error",
        "Se produjo un error al procesar la petición.",
        "error"
      );
    }
  };

  return (
    <div className="form-wrapper">
      <div className="login-form-container">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-4">
            <Col>
              <h2 className="text-center">Registro</h2>
            </Col>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridNombres">
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
            <Form.Group as={Col} controlId="formGridApellidos">
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
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridNickname">
              <Form.Label>Nickname</Form.Label>
              <Form.Control
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Ingrese un nickname.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridClave">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="clave"
                value={formData.clave}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Ingrese una contraseña.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridclaveCon">
              <Form.Label>Confirmar contraseña</Form.Label>
              <Form.Control
                type="password"
                name="claveCon"
                value={formData.claveCon}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Ingrese la contraseña de confirmación.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Form.Group className="mb-3" controlId="formGridTelefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGridDireccion">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
            />
          </Form.Group>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridDepartamento">
              <Form.Label>Departamento</Form.Label>
              <Form.Select
                name="idDepartamento"
                value={formData.idDepartamento}
                onChange={handleChange}
              >
                {isLoading ? (
                  <option>Cargando...</option>
                ) : (
                  departamentos.map((depto) => (
                    <option
                      key={depto.id_departamento}
                      value={depto.id_departamento}
                    >
                      {depto.nombre}
                    </option>
                  ))
                )}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Seleccione un departamento.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mt-4 justify-content-center">
            <Col xs="auto">
              <Button variant="primary" type="submit" className="me-3">
                Crear
              </Button>
              <Button variant="secondary" onClick={cleanForm}>
                Limpiar
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}

export default RegistroForm;
