// Importação dos pacotes necessários
import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Container, Form } from 'react-bootstrap';
import { FiSearch } from 'react-icons/fi';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './suus.scss';

// Componente principal
const NR3 = () => {
  // Declaração dos estados e outras variáveis
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const history = useHistory();

  // Funções de interação com a API
  useEffect(() => {
    carregarUsuarios();
  }, []);
  
  const carregarUsuarios = async () => {
    try {
      const instituicaoNome = localStorage.getItem('instituicaoNome'); // Substitua pela chave correta se necessário
      const url = `${process.env.REACT_APP_API_URL}/usuarios?instituicaoNome=${instituicaoNome}`;
      
      const response = await axios.get(url);
      setUsuarios(response.data || []); // garanta que é um array
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Funções de manipulação de eventos
  const handleEdit = (id) => {
    history.push(`/admin/GerenciarUsuario`);
  };

  const handleRedirect = () => {
    history.push('/admin/GerenciarUsuario');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtragem de usuários
  const filteredUsuarios = (usuarios || []).filter(usuario =>
    (usuario.nomecompleto && usuario.nomecompleto.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (usuario.email && usuario.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Renderização do componente
  return (
    <Container fluid className="d-flex flex-column align-items-center">
      <Card className="w-100 mb-3 search-card">
        <Card.Body>
          <div style={{ position: 'relative' }}>
            <Form.Control
              type="text"
              placeholder="Pesquisar por nome ou email"
              value={searchTerm}
              onChange={handleSearch}
              className="rounded-pill search-input"
            />
            <FiSearch style={{
              position: 'absolute',
              top: '50%',
              right: '10px',
              transform: 'translateY(-50%)',
              fontSize: '20px'
            }} />
          </div>
        </Card.Body>
      </Card>

      <Card className="w-100 table-card">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table striped bordered hover className="m-0 table-users">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th></th> {/* Nova coluna adicionada */}
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsuarios.map(usuario => (
                  <tr key={usuario.id}>
                    <td>{usuario.nomecompleto}</td>
                    <td>{usuario.email}</td>
                    <td>
                      {usuario.acesso && usuario.acesso.includes('Paciente') && (
                        <img
                          src="https://imgur.com/gu41gtn.png" alt="Paciente" style={{ width: '24px', height: '24px', marginRight: '5px' }} title="Paciente"/>
                      )}
                      {usuario.acesso && usuario.acesso.includes('Admin') && (
                        <img
                          src="https://imgur.com/42Dk9YN.png" alt="Administrador" style={{ width: '24px', height: '24px', marginRight: '5px' }} title="Administrador"/>
                      )}
                      {usuario.acesso && usuario.acesso.includes('Medico') && (
                        <img
                          src="https://imgur.com/Pa2cWcB.png" alt="Medico" style={{ width: '24px', height: '24px', marginRight: '5px' }} title="Médico"/>
                      )}
                    </td>
                    <td className="text-center">
                      <Button variant="light" onClick={() => handleEdit(usuario.id)}>
                        <img src="https://imgur.com/Z8FjlyT.png" alt="Editar" width="24" height="24" />
                      </Button>
                      <Button variant="light" onClick={handleRedirect} >
                        <img src="https://imgur.com/eIhi3oc.png" alt="Ir para Gerenciamento de Usuarios" width="24" height="24" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default NR3;
