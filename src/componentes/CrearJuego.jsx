import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap';
import './styles.css'; // Importa el archivo de estilos

const CrearJuego = () => {
    const [titulo, setTitulo] = useState('');
    const [fechaLanzamiento, setFechaLanzamiento] = useState('');
    const [clasificacion, setClasificacion] = useState('');
    const [desarrolladores, setDesarrolladores] = useState([]);
    const [desarrolladoresSeleccionados, setDesarrolladoresSeleccionados] = useState([]);
    const [generos, setGeneros] = useState([]);  // Estado para los géneros
    const [generosSeleccionados, setGenerosSeleccionados] = useState([]);  // Estado para los géneros seleccionados
    const [imagen, setImagen] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(''); // Estado para la URL de vista previa

    useEffect(() => {
        // Cargar desarrolladores
        axios.get('http://localhost:3020/desarrolladores')
            .then(response => {
                setDesarrolladores(response.data);
            })
            .catch(error => {
                console.error("Error al cargar desarrolladores", error);
            });

        // Cargar géneros
        axios.get('http://localhost:3020/generos')
            .then(response => {
                setGeneros(response.data);
            })
            .catch(error => {
                console.error("Error al cargar géneros", error);
            });
    }, []);

    const handleCheckboxChange = (id, setFunction) => {
        setFunction(prevState => {
            if (prevState.includes(id)) {
                return prevState.filter(itemId => itemId !== id);
            } else {
                return [...prevState, id];
            }
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImagen(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result); // Genera la URL de la imagen
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl(''); // Resetea la vista previa si no hay archivo seleccionado
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const desarrolladoresJson = JSON.stringify(desarrolladoresSeleccionados);
        const generosJson = JSON.stringify(generosSeleccionados);  // Convertir géneros seleccionados a JSON
        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('fecha_lanzamiento', fechaLanzamiento);
        formData.append('clasificacion', clasificacion);
        formData.append('desarrolladores_ids', desarrolladoresJson);
        formData.append('generos_ids', generosJson);  // Añadimos los géneros al FormData
        formData.append('image_data', imagen); // Añadimos la imagen al FormData

        axios.post('http://localhost:3020/crearJuego', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log('Juego creado exitosamente:', response.data);
                setTitulo('');
                setFechaLanzamiento('');
                setClasificacion('');
                setDesarrolladoresSeleccionados([]);
                setGenerosSeleccionados([]);
                setImagen(null);
                setPreviewUrl(''); // Limpiamos la vista previa
            })
            .catch(error => {
                console.error("Error al crear el juego", error);
            });
    };

    return (
        <Container className="mt-4">
            <Card>
                <Card.Header as="h5">Crear Nuevo Juego</Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group as={Row} controlId="formTitulo">
                            <Form.Label column sm="3" className="text-left">Título</Form.Label>
                            <Col sm="9">
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese el título del juego"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    required
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formFechaLanzamiento">
                            <Form.Label column sm="3" className="text-left">Fecha de Lanzamiento</Form.Label>
                            <Col sm="9">
                                <Form.Control
                                    type="date"
                                    value={fechaLanzamiento}
                                    onChange={(e) => setFechaLanzamiento(e.target.value)}
                                    required
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formClasificacion">
                            <Form.Label column sm="3" className="text-left">Clasificación</Form.Label>
                            <Col sm="9">
                                <Form.Control
                                    as="select"
                                    value={clasificacion}
                                    onChange={(e) => setClasificacion(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione la clasificación</option>
                                    <option value="ec">EC</option>
                                    <option value="e">E</option>
                                    <option value="e10+">E10+</option>
                                    <option value="t">T</option>
                                    <option value="m">M</option>
                                    <option value="ao">AO</option>
                                    <option value="rp">RP</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formDesarrolladores">
                            <Form.Label column sm="3" className="text-left">Desarrolladores</Form.Label>
                            <Col sm="9">
                                <div className="checkbox-list">
                                    {desarrolladores.map(desarrollador => (
                                        <div key={desarrollador.id_desarrollador} className="checkbox-item">
                                            <Form.Check
                                                type="checkbox"
                                                id={`desarrollador-${desarrollador.id_desarrollador}`}
                                                label={desarrollador.nombre}
                                                value={desarrollador.id_desarrollador}
                                                checked={desarrolladoresSeleccionados.includes(desarrollador.id_desarrollador)}
                                                onChange={() => handleCheckboxChange(desarrollador.id_desarrollador, setDesarrolladoresSeleccionados)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formGeneros">
                            <Form.Label column sm="3" className="text-left">Géneros</Form.Label>
                            <Col sm="9">
                                <div className="checkbox-list">
                                    {generos.map(genero => (
                                        <div key={genero.id_genero} className="checkbox-item">
                                            <Form.Check
                                                type="checkbox"
                                                id={`genero-${genero.id_genero}`}
                                                label={genero.nombre}
                                                value={genero.id_genero}
                                                checked={generosSeleccionados.includes(genero.id_genero)}
                                                onChange={() => handleCheckboxChange(genero.id_genero, setGenerosSeleccionados)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formImagen">
                            <Form.Label column sm="3" className="text-left">Imagen del Juego</Form.Label>
                            <Col sm="9">
                                <Form.Control
                                    type="file"
                                    name="image_data"
                                    onChange={handleImageChange} // Usa el nuevo manejador de cambio de imagen
                                    required
                                />
                                {previewUrl && ( // Si hay una imagen seleccionada, muestra la vista previa
                                    <img
                                        src={previewUrl}
                                        alt="Vista previa"
                                        style={{ marginTop: '10px', maxHeight: '200px', maxWidth: '100%' }}
                                    />
                                )}
                            </Col>
                        </Form.Group>

                        <Button variant="success" type="submit" className="mt-3">
                            Crear Juego
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CrearJuego;
