import React, { useContext, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config/config";
import axios from "axios";
import "./Login.css";
import Swal from "sweetalert2";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [errors, setErrors] = useState("");
  const { login, isLoggedIn } = useContext(AuthContext);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!email) newErrors.email = "Ingrese su correo.";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Ingrese un correo válido";

    if (!clave) newErrors.clave = "Ingrese su contraseña.";

    return newErrors;
  };

  const clearForm = () => {
    setEmail("");
    setClave("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    } else {
      setErrors({});
      console.log("Login attempted with:", { email, clave });
    }

    signIn(email, clave);
  };

  const signIn = async (email, clave) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/autenticacion/iniciarSesion`,
        {
          email,
          clave,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const { token: accessToken, usuario } = response.data;

        login(accessToken, usuario);

        clearForm();

        navigate("/inicio");
      }
    } catch (error) {
      if (error?.status === 401 || error?.status === 404) {
        Swal.fire("Información", `${error.response.data.message}`, "warning");
      } else {
        Swal.fire(
          "Información",
          "No se pudo iniciar sesión. Intente más tarde",
          "warning"
        );
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-form-container">
        <h2 className="login-title">Ingresar</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Correo:</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
            />
          </Form.Group>
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              isInvalid={!!errors.clave}
            />
            <Form.Control.Feedback type="invalid">
              {errors.clave}
            </Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Aceptar
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default LoginForm;
