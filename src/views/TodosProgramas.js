import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert, Table } from 'react-bootstrap';
import axios from 'axios';
import './TodosProgramas.scss'; 

const TodosProgramas = () => {
  const [nome_programa, setNomePrograma] = useState('');
  const [link_form, setLinkForm] = useState('');
  const [programas, setProgramas] = useState([]);
  const [notification, setNotification] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isEditing, setIsEditing] = useState(false);


  const handleInputChange = (e, field) => {
    setSelectedProgram({ ...selectedProgram, [field]: e.target.value });
  };
  

  const handleSave = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/programas/${selectedProgram.id}`;
      const updatedData = {
        nome_programa: selectedProgram.nome_programa,
        link_form: selectedProgram.link_form,
      };
  
      const response = await axios.put(url, updatedData);
  
      if (response.data.success) {
        // Atualize o estado dos programas aqui, se necessário
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Erro ao salvar as alterações:", error);
    }
  };
  
  const handleDelete = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/programas/${selectedProgram.id}`;
      const response = await axios.delete(url);
  
      if (response.data.success) {
        // Remova o programa do estado aqui
      }
    } catch (error) {
      console.error("Erro ao excluir o programa:", error);
    }
  };
  
  useEffect(() => {
    const instituicaoNome = localStorage.getItem('instituicaoNome');
    axios.get(`${process.env.REACT_APP_API_URL}/programas?instituicaoNome=${instituicaoNome}`)
      .then(response => {
        setProgramas(response.data);
      })
      .catch(error => {
        console.error("Error fetching programas:", error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const instituicaoNome = localStorage.getItem('instituicaoNome');

    const programDetails = {
      nome_programa: nome_programa,
      link_form: link_form,
      instituicaoNome: instituicaoNome
    };

    axios.post(`${process.env.REACT_APP_API_URL}/programas`, programDetails)
      .then(response => {
        setNotification({ type: 'success', message: 'Programa criado com sucesso!' });
        return axios.get(`${process.env.REACT_APP_API_URL}/programas?instituicaoNome=${instituicaoNome}`);
      })
      .then(response => {
        setProgramas(response.data);
      })
      .catch(error => {
        setNotification({ type: 'danger', message: 'Erro ao criar programa' });
      });
  };

  return (
    <Container>
      <Row>
        
        <Col md={12} className="form-col rounded">
        <h4 className="text-bold">Criar Avaliação</h4>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Nome da Avaliação:</Form.Label>
              <Form.Control type="text" value={nome_programa} onChange={e => setNomePrograma(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Link do Form:</Form.Label>
              <Form.Control type="text" value={link_form} onChange={e => setLinkForm(e.target.value)} />
            </Form.Group>
            <Button className="custom-btn" type="submit">Cadastrar Avaliação</Button>
          </Form>
        </Col>
      </Row>

      <hr />

      <h4 className="text-bold">Avaliações Ativas</h4>

      <Row>
        {programas.map((programa, index) => (
          <Col md={4} key={index} className="program-card active-program">
            <Card>
              <Card.Body className="program-card-body">
                <Card.Title className="program-card-title">{programa.nome_programa}</Card.Title>
                <Card.Text>
                  <a href={programa.link_form} target="_blank" rel="noopener noreferrer" className="program-card-link">
                    Link da Avaliação
                  </a>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <hr />

      
      <Row>
        <Col md={12} className="form-col rounded">
          {/* Conteúdo da coluna "Editar Avaliações" */}
          <h4 className="text-bold">Editar Avaliações</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Selecionar Avaliação:</th>
              </tr>
            </thead>
            <tbody>
              {programas.map((programa, index) => (
                <tr key={index} onClick={() => setSelectedProgram(programa)}>
                  <td>{programa.nome_programa}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {selectedProgram && (
            <>
              <h4>Avaliação selecionada: {selectedProgram.nome_programa}</h4>
              {/* Tabela de Edição */}
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Nome da Avaliação:</th>
                    <th>Link do Form:</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {isEditing ? (
                        <input type="text" value={selectedProgram.nome_programa} onChange={(e) => handleInputChange(e, 'nome_programa')} />
                      ) : (
                        selectedProgram.nome_programa
                      )}
                    </td>
                    <td className="table-link-cell">
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={selectedProgram.link_form} 
                          style={{width: '100%'}} 
                          onChange={(e) => handleInputChange(e, 'link_form')}
                        />
                      ) : (
                        selectedProgram.link_form
                      )}
                    </td>
                                      </tr>
                </tbody>
              </Table>
              {isEditing ? (
                <>
                  <Button className="custom-btn" onClick={handleSave}>Salvar</Button>
                  <Button className="custom-btn" onClick={() => setIsEditing(false)}>Cancelar</Button>

                </>
              ) : (
                <>
                  <Button className="custom-btn" onClick={() => setIsEditing(true)}>Editar</Button>
                  <Button className="custom-btn" onClick={handleDelete}>Excluir</Button>
                </>
              )}
            </>
          )}
        </Col>
      </Row>

      {notification && (
        <Alert variant={notification.type}>
          {notification.message}
        </Alert>
      )}
    </Container>
  );
};

export default TodosProgramas;