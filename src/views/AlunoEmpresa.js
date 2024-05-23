import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Alert, Table, Container, Modal, Row } from 'react-bootstrap';
import { FiSearch } from 'react-icons/fi';
import { updateUser } from '../redux/actions/userActions';
import './NovoAluno.css';
import axios from 'axios';
import { fetchUsersEmpresa } from '../redux/actions/dashboardActions.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { getAlunosEmpresaCount } from '../redux/actions/dashboardActions';

const AlunoEmpresa = () => {
  const dispatch = useDispatch();
  const usuarios = useSelector(state => state.user.usersEmpresa);
  const { authState } = useContext(AuthContext);

  const [newAluno, setNewAluno] = useState({
    empresa: authState.username,
    username: '',
    nome: '',
    sobrenome: '',
    cep: '',
    cidade: '',
    endereco: '',
    pais: '',
    email: '',
    role: 'Aluno',
    senha: '',
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState('');
  const [editableUser, setEditableUser] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchUsersEmpresa(authState.username));
  }, [dispatch, authState.username]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAluno({
      ...newAluno,
      [name]: value,
    });
  };

  const handleEdit = (email) => {
    const selectedUser = filteredUsuarios.find(u => u.email === email);
    if (selectedUser) {
      setEditableUser(selectedUser);
      setShowModal(true);
    } else {
      console.error("Usuário selecionado não encontrado.");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/add-aluno`, newAluno);
      if (response.data.success) {
        setShowAlert(true);
        setAlertContent('Aluno adicionado com sucesso!');

        setNewAluno({
          empresa: authState.username,
          username: '',
          nome: '',
          sobrenome: '',
          cep: '', // Limpar os campos após o envio
          cidade: '',
          endereco: '',
          pais: '',
          email: '',
          role: 'Aluno',
          senha: '',
        });

        // Atualizar a lista de usuários após adicionar um novo aluno
        dispatch(fetchUsersEmpresa(authState.username));

        dispatch(getAlunosEmpresaCount(authState.username));
      } else {
        setShowAlert(true);
        setAlertContent('Erro ao adicionar aluno.');
      }
    } catch (error) {
      console.error('Erro ao enviar os dados do novo aluno:', error);
      setShowAlert(true);
      setAlertContent('Erro ao adicionar aluno. Verifique o console para mais detalhes.');
    }
  };

  const handleDelete = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/delete-aluno/${userToDelete}`);
      if (response.data.success) {
        dispatch(fetchUsersEmpresa(authState.username));
        setShowDeleteModal(false);
        toast.success("Exclusão efetuada com sucesso.");
      } else {
        toast.error("Erro ao excluir aluno.");
      }
    } catch (error) {
      console.error('Erro ao excluir aluno:', error);
      toast.error("Erro ao excluir aluno.");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setEditableUser({
      ...editableUser,
      [name]: value,
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editableUser.id) {
      console.error('ID do usuário não está presente.');
      return;
    }

    const userData = {
      userId: editableUser.id,
      empresa: editableUser.empresa,
      nome: editableUser.nome,
      sobrenome: editableUser.sobrenome,
      email: editableUser.email,
      endereco: editableUser.endereco,
      cidade: editableUser.cidade,
      cep: editableUser.cep,
      pais: editableUser.pais,
      role: editableUser.role,
      username: editableUser.username,
    };

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/user/profileEdit`, userData);
      if (response.data.success) {
        setShowModal(false);
        dispatch(updateUser(userData));
        dispatch(fetchUsersEmpresa(authState.username));
      } else {
        alert('Erro ao atualizar usuário.');
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      alert('Erro ao atualizar usuário. Verifique o console para mais detalhes.');
    }
  };

  // Filtragem de usuários da empresa
  const filteredUsuarios = (usuarios || []).filter(usuario =>
    usuario.empresa === authState.username &&
    ((usuario.nome && usuario.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (usuario.email && usuario.email.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <Container className="mt-4">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <center><div className='back'><h1 style={{ fontFamily: 'Montserrat', fontSize: '28pt' }}>Gerenciamento de Usuários</h1></div></center>

      <div className='back1'>
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
      </div>

      <div className='back1'>
        <div className="table-responsive">
          <Table striped bordered hover className="m-0 table-users">
            <thead>
              <tr style={{color:'black', fontWeight:'bold', fontFamily:'Montserrat'}}>
                <th>Nome</th>
                <th>Email</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.map(usuario => (
                <tr key={usuario.id} onClick={() => setSelectedUserEmail(usuario.email)}>
                  <td>{usuario.nome}</td>
                  <td>{usuario.email}</td>
                  <td className="text-center">
                    <Button variant="light" onClick={() => handleEdit(usuario.email)}>
                      <img src="https://imgur.com/eIhi3oc.png" alt="Editar" width="24" height="24" />
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(usuario.id)}>
                      <img src="https://imgur.com/WkU1RFZ.png" alt="Excluir" width="24" height="24" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      <hr />
      <Row>
        <div className='back1'>
          <center><h6 style={{color:'black', fontFamily:'Montserrat'}}>Adicionar Novo Aluno</h6></center>
          {showAlert && <Alert variant="info">{alertContent}</Alert>}
          <Form onSubmit={handleSubmit}>
            {/* Empresa é definida automaticamente */}
            <Form.Group>
            
              <p style={{fontFamily:'Montserrat',  marginTop:'15px'}}>Nome de usuário</p>
              <Form.Control
                type="text"
                name="username"
                value={newAluno.username}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <p style={{fontFamily:'Montserrat',  marginTop:'15px'}}>Primeiro Nome</p>
              <Form.Control
                type="text"
                name="nome"
                value={newAluno.nome}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <p style={{fontFamily:'Montserrat',  marginTop:'15px'}}>Sobrenome</p>
              <Form.Control
                type="text"
                name="sobrenome"
                value={newAluno.sobrenome}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group>
      <p style={{fontFamily:'Montserrat',  marginTop:'15px'}}>CEP</p>
      <Form.Control
        type="text"
        name="cep"
        value={newAluno.cep}
        onChange={handleInputChange}
      />
    </Form.Group>
    <Form.Group>
      <p style={{fontFamily:'Montserrat',  marginTop:'15px'}}>Cidade</p>
      <Form.Control
        type="text"
        name="cidade"
        value={newAluno.cidade}
        onChange={handleInputChange}
      />
    </Form.Group>
    <Form.Group>
      <p style={{fontFamily:'Montserrat',  marginTop:'15px'}}>Endereço</p>
      <Form.Control
        type="text"
        name="endereco"
        value={newAluno.endereco}
        onChange={handleInputChange}
      />
    </Form.Group>
    <Form.Group>
      <p style={{fontFamily:'Montserrat',  marginTop:'15px'}}>País</p>
      <Form.Control
        type="text"
        name="pais"
        value={newAluno.pais}
        onChange={handleInputChange}
      />
    </Form.Group>
            <Form.Group>
              <p style={{fontFamily:'Montserrat',  marginTop:'15px'}}>Email</p>
              <Form.Control
                type="email"
                name="email"
                value={newAluno.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <p style={{fontFamily:'Montserrat',  marginBottom:'15px'}}>Senha</p>
              <Form.Control
                type="password"
                name="senha"
                value={newAluno.senha}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="btn-suus" style={{ backgroundColor: 'black' }}>
              Adicionar Aluno
            </Button>
          </Form>
        </div>
      </Row>

      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)} dialogClassName="custom-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>Dados do Usuário</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body custom-scroll">
          {selectedUserEmail && editableUser && (
            <Form onSubmit={handleUpdateUser}>
          
              {/* Empresa não é editável */}
              <Form.Group>
                <h5>Usuário</h5>
                <Form.Control type="text" name="username" value={editableUser.username} readOnly />
              </Form.Group>
              <Form.Group>
                <h5>Nome</h5>
                <Form.Control type="text" name="nome" value={editableUser.nome} onChange={handleUserChange} required />
              </Form.Group>
              <Form.Group>
                <h5>Sobrenome</h5>
                <Form.Control type="text" name="sobrenome" value={editableUser.sobrenome} onChange={handleUserChange} required />
              </Form.Group>
              <Form.Group>
                <h5>Email</h5>
                <Form.Control type="email" name="email" value={editableUser.email} onChange={handleUserChange} required />
              </Form.Group>
              <Form.Group>
                <h5>Endereço</h5>
                <Form.Control type="text" name="endereco" value={editableUser.endereco} onChange={handleUserChange} />
              </Form.Group>
              <Form.Group>
                <h5>Cidade</h5>
                <Form.Control type="text" name="cidade" value={editableUser.cidade} onChange={handleUserChange} />
              </Form.Group>
              <Form.Group>
                <h5>CEP</h5>
                <Form.Control type="text" name="cep" value={editableUser.cep} onChange={handleUserChange} />
              </Form.Group>
              <Form.Group>
                <h5>País</h5>
                <Form.Control type="text" name="pais" value={editableUser.pais} onChange={handleUserChange} />
              </Form.Group>
         
              <Button variant="primary" type="submit" className="btn-suus" style={{ backgroundColor: 'black' }}>
                Alterar Dados do Usuário
              </Button>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
      <Modal show={showDeleteModal} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Excluir Usuário</Modal.Title>
        </Modal.Header>
        <Modal.Body>Deseja excluir o Usuário? Isso não é reversível.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Sim, quero excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AlunoEmpresa;