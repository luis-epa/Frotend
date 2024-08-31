import React, { useEffect, useState } from "react";
import { Card, Button, Col, Row, Container, Form } from "react-bootstrap";
import "./styles.css"; // Asegúrate de importar el archivo CSS
import { API_BASE_URL } from "../config/config";

const Catalogo = () => {
  const [juegos, setJuegos] = useState([]); // Estado para almacenar juegos
  const [generos, setGeneros] = useState([]); // Estado para almacenar los géneros
  const [generoSeleccionado, setGeneroSeleccionado] = useState(""); // Estado para el género seleccionado
  const [desarrolladores, setDesarrolladores] = useState([]); // Estado para almacenar los desarrolladores
  const [desarrolladorSeleccionado, setDesarrolladorSeleccionado] =
    useState(""); // Estado para el desarrollador seleccionado
  const [clasificacionSeleccionada, setClasificacionSeleccionada] =
    useState(""); // Estado para la clasificación seleccionada
  const [mostrarVentas, setMostrarVentas] = useState(false); // Estado para controlar si se muestran las ventas

  // Lista estática de clasificaciones
  const clasificaciones = ["e", "ec", "e10+", "m", "rp"];

  // Cargar juegos
  useEffect(() => {
    fetch(`${API_BASE_URL}/verJuegos`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos de juegos recibidos:", data); // Verificar los datos recibidos
        setJuegos(Array.isArray(data) ? data : []); // Asegurarse de que los datos sean un arreglo
      })
      .catch((error) => console.error("Error al cargar los juegos:", error));
  }, []);

  // Cargar géneros
  useEffect(() => {
    fetch(`${API_BASE_URL}/generos`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos de géneros recibidos:", data); // Verificar los datos recibidos
        setGeneros(Array.isArray(data) ? data : []); // Asegurarse de que los datos sean un arreglo
      })
      .catch((error) => console.error("Error al cargar los géneros:", error));
  }, []);

  // Cargar desarrolladores
  useEffect(() => {
    fetch(`${API_BASE_URL}/desarrolladores`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos de desarrolladores recibidos:", data); // Verificar los datos recibidos
        setDesarrolladores(Array.isArray(data) ? data : []); // Asegurarse de que los datos sean un arreglo
      })
      .catch((error) =>
        console.error("Error al cargar los desarrolladores:", error)
      );
  }, []);

  // Manejar el cambio de selección del género
  const handleGeneroChange = (e) => {
    setGeneroSeleccionado(e.target.value); // Actualizar el estado con el género seleccionado
  };

  // Manejar el cambio de selección del desarrollador
  const handleDesarrolladorChange = (e) => {
    setDesarrolladorSeleccionado(e.target.value); // Actualizar el estado con el desarrollador seleccionado
  };

  // Manejar el cambio de selección de la clasificación
  const handleClasificacionChange = (e) => {
    setClasificacionSeleccionada(e.target.value); // Actualizar el estado con la clasificación seleccionada
  };

  // Filtrar juegos por género
  const filtrarJuegosPorGenero = () => {
    setMostrarVentas(false); // No mostrar ventas en esta consulta
    if (generoSeleccionado === "") {
      // Mostrar todos los juegos si no hay género seleccionado
      fetch(`${API_BASE_URL}/verJuegos`)
        .then((response) => response.json())
        .then((data) => setJuegos(Array.isArray(data) ? data : []))
        .catch((error) => console.error("Error al cargar los juegos:", error));
    } else {
      // Filtrar juegos por género seleccionado
      fetch(`${API_BASE_URL}/porgenero`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genre: generoSeleccionado }),
      })
        .then((response) => response.json())
        .then((data) => setJuegos(Array.isArray(data) ? data : []))
        .catch((error) =>
          console.error("Error al filtrar los juegos por género:", error)
        );
    }
  };

  // Filtrar juegos por desarrollador
  const filtrarJuegosPorDesarrollador = () => {
    setMostrarVentas(false); // No mostrar ventas en esta consulta
    if (desarrolladorSeleccionado === "") {
      fetch(`${API_BASE_URL}/verJuegos`)
        .then((response) => response.json())
        .then((data) => setJuegos(Array.isArray(data) ? data : []))
        .catch((error) => console.error("Error al cargar los juegos:", error));
    } else {
      fetch(`${API_BASE_URL}/pordesarrollador`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ developer: desarrolladorSeleccionado }),
      })
        .then((response) => response.json())
        .then((data) => setJuegos(Array.isArray(data) ? data : []))
        .catch((error) =>
          console.error("Error al filtrar los juegos por desarrollador:", error)
        );
    }
  };

  // Filtrar juegos por clasificación
  const filtrarJuegosPorClasificacion = () => {
    setMostrarVentas(false); // No mostrar ventas en esta consulta
    if (clasificacionSeleccionada === "") {
      fetch(`${API_BASE_URL}/verJuegos`)
        .then((response) => response.json())
        .then((data) => setJuegos(Array.isArray(data) ? data : []))
        .catch((error) => console.error("Error al cargar los juegos:", error));
    } else {
      fetch(`${API_BASE_URL}/verclasificacion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clasificacion: clasificacionSeleccionada }),
      })
        .then((response) => response.json())
        .then((data) => setJuegos(Array.isArray(data) ? data : []))
        .catch((error) =>
          console.error("Error al filtrar los juegos por clasificación:", error)
        );
    }
  };

  // Filtrar juegos por los más comprados
  const filtrarJuegosMasComprados = () => {
    fetch(`${API_BASE_URL}/mascomprados`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Juegos más comprados:", data); // Verificar los datos recibidos
        setMostrarVentas(true); // Mostrar el número de ventas en esta consulta
        setJuegos(Array.isArray(data) ? data : []); // Asegurarse de que los datos sean un arreglo
      })
      .catch((error) =>
        console.error("Error al cargar los juegos más comprados:", error)
      );
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col md={3}>
          <Form.Group controlId="formGenero">
            <Form.Label>Filtrar por Género</Form.Label>
            <Form.Control
              as="select"
              value={generoSeleccionado}
              onChange={handleGeneroChange}
            >
              <option value="">Todos los Géneros</option>
              {generos.map((genero) => (
                <option key={genero.id_genero} value={genero.nombre}>
                  {genero.nombre}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button
            variant="primary"
            onClick={filtrarJuegosPorGenero}
            className="mt-2"
          >
            Filtrar Juegos por Género
          </Button>
        </Col>
        <Col md={3}>
          <Form.Group controlId="formDesarrollador">
            <Form.Label>Filtrar por Desarrollador</Form.Label>
            <Form.Control
              as="select"
              value={desarrolladorSeleccionado}
              onChange={handleDesarrolladorChange}
            >
              <option value="">Todos los Desarrolladores</option>
              {desarrolladores.map((desarrollador) => (
                <option
                  key={desarrollador.id_desarrollador}
                  value={desarrollador.nombre}
                >
                  {desarrollador.nombre}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button
            variant="primary"
            onClick={filtrarJuegosPorDesarrollador}
            className="mt-2"
          >
            Filtrar Juegos por Desarrollador
          </Button>
        </Col>
        <Col md={3}>
          <Form.Group controlId="formClasificacion">
            <Form.Label>Filtrar por Clasificación</Form.Label>
            <Form.Control
              as="select"
              value={clasificacionSeleccionada}
              onChange={handleClasificacionChange}
            >
              <option value="">Todas las Clasificaciones</option>
              {clasificaciones.map((clasificacion, index) => (
                <option key={index} value={clasificacion}>
                  {clasificacion}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button
            variant="primary"
            onClick={filtrarJuegosPorClasificacion}
            className="mt-2"
          >
            Filtrar Juegos por Clasificación
          </Button>
        </Col>
        <Col md={3}>
          <Form.Label>Mostrar los Más Comprados</Form.Label>
          <Button
            variant="success"
            onClick={filtrarJuegosMasComprados}
            className="d-block mt-2"
          >
            Ver Más Comprados
          </Button>
        </Col>
      </Row>

      <Row className="g-4">
        {juegos.map((juego) => (
          <Col key={juego.id_juego} md={3} sm={6} xs={12}>
            <Card style={{ width: "100%" }} className="h-100">
              <div className="img-container">
                <Card.Img
                  variant="top"
                  src={`data:image/jpeg;base64,${juego.image_data}`}
                  alt={juego.titulo}
                />
              </div>
              <Card.Body>
                <Card.Title>{juego.titulo}</Card.Title>
                <Card.Text>
                  <strong>Fecha de Lanzamiento:</strong>{" "}
                  {new Date(juego.fecha_lanzamiento).toLocaleDateString()}
                  <br />
                  <strong>Clasificación:</strong> {juego.clasificacion}
                  <br />
                  <strong>Desarrolladores:</strong> {juego.desarrolladores}
                  {mostrarVentas && (
                    <>
                      <br />
                      <strong>Número de Ventas:</strong> {juego.num_ventas}
                    </>
                  )}
                </Card.Text>
                <Button variant="primary">Ver más</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Catalogo;
