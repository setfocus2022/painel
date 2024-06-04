import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Alert, Table, Container, Modal, Row } from 'react-bootstrap';
import { FiSearch } from 'react-icons/fi';
import { fetchUsers, updateUser } from '../redux/actions/userActions'; 
import './NovoAluno.css';
import axios from 'axios'; 
import { setUsers } from '../redux/actions/userActions.js'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const AdicionarAlunos = () => {
  const dispatch = useDispatch();
  const usuarios = useSelector(state => state.user.users); 

  const [novaEmpresa, setNovaEmpresa] = useState({
    cnpj: '',
    nome: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    telefone: '',
    responsavel: '',
    email: '', 
    senha: '', 
  });

  const handleSubmitEmpresa = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/Updateempresas`, novaEmpresa);
      if (response.data.success) {
        toast.success("Empresa cadastrada com sucesso!");
        setNovaEmpresa({
          cnpj: '',
          nome: '',
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: '',
          cep: '',
          telefone: '',
          responsavel: '',
          email: '', 
          senha: '', 
        });
      } else {
        toast.error("Erro ao cadastrar empresa.");
      }
    } catch (error) {
      console.error('Erro ao enviar os dados da nova empresa:', error);
      toast.error("Erro ao cadastrar empresa. Verifique o console para mais detalhes.");
    }
  };

  const handleEmpresaInputChange = (e) => {
    const { name, value } = e.target;
    setNovaEmpresa({
      ...novaEmpresa,
      [name]: value,
    });
  };

  const [newAluno, setNewAluno] = useState({
    empresa: '', 
    username: '',
    nome: '',
    sobrenome: '',
    email: '',
    role: 'Aluno',
    senha: '',
  });

  const [selectedEmpresa, setSelectedEmpresa] = useState(''); 

  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState('');
  const [editableUser, setEditableUser] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [searchTermEmpresa, setSearchTermEmpresa] = useState('');
  const [showEmpresaModal, setShowEmpresaModal] = useState(false);
  const [editableEmpresa, setEditableEmpresa] = useState({});
  const [showDeleteEmpresaModal, setShowDeleteEmpresaModal] = useState(false);
  const [empresaToDelete, setEmpresaToDelete] = useState(null);

  // Funções para empresas
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/empresas`);
        setEmpresas(response.data);
      } catch (error) {
        console.error('Erro ao buscar empresas:', error);
      }
    };
    fetchEmpresas();
  }, []);

  const handleEmpresaSearch = (e) => {
    setSearchTermEmpresa(e.target.value);
  };

  const handleEditEmpresa = (id) => {
    const empresa = empresas.find(emp => emp.id === id);
    setEditableEmpresa(empresa);
    setShowEmpresaModal(true);
  };

  const handleDeleteEmpresa = (empresaId) => {
    setEmpresaToDelete(empresaId);
    setShowDeleteEmpresaModal(true);
  };

  const confirmDeleteEmpresa = async () => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/empresas/${empresaToDelete}`);
      if (response.data.success) {
        setEmpresas(empresas.filter(emp => emp.id !== empresaToDelete));
        setShowDeleteEmpresaModal(false);
        toast.success("Empresa excluída com sucesso.");
      } else {
        toast.error("Erro ao excluir empresa.");
      }
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      toast.error("Erro ao excluir empresa.");
    }
  };

  const cancelDeleteEmpresa = () => {
    setShowDeleteEmpresaModal(false);
  };

  const handleEmpresaChange = (e) => {
    const { name, value } = e.target;
    setEditableEmpresa({
      ...editableEmpresa,
      [name]: value,
    });
  };

  const handleUpdateEmpresa = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/empresas/${editableEmpresa.id}`, editableEmpresa);
      if (response.data.success) {
        const updatedEmpresas = empresas.map(emp =>
          emp.id === editableEmpresa.id ? editableEmpresa : emp
        );
        setEmpresas(updatedEmpresas);
        setShowEmpresaModal(false);
        toast.success("Empresa atualizada com sucesso!");
      } else {
        toast.error("Erro ao atualizar empresa.");
      }
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      toast.error("Erro ao atualizar empresa. Verifique o console para mais detalhes.");
    }
  };

  // Filtragem de empresas
  const filteredEmpresas = empresas.filter(empresa =>
    (empresa.nome && empresa.nome.toLowerCase().includes(searchTermEmpresa.toLowerCase())) ||
    (empresa.email && empresa.email.toLowerCase().includes(searchTermEmpresa.toLowerCase()))
  );

  // Função chamada quando o botão de exclusão é clicado
  const handleDelete = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/delete-aluno/${userToDelete}`);
      if (response.data.success) {
        dispatch(fetchUsers());
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

  useEffect(() => {
    dispatch(fetchUsers()); 
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableUser({ 
      ...editableUser,
      [name]: value,
    });
  };

  const handleNewAlunoChange = (e) => { // Nova função para o formulário de adicionar aluno
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
    
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/empresas`);
        setEmpresas(response.data);
      } catch (error) {
        console.error('Erro ao buscar empresas:', error);
      }
    };
    fetchEmpresas();
  }, []);

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
          username: '',
          nome: '',
          sobrenome: '',
          email: '',
          role: 'Aluno',
          empresa: '', 
          senha: '',
        });
        dispatch(fetchUsers()); 
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

  const filteredUsuarios = (usuarios || []).filter(usuario =>
    (usuario.nome && usuario.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (usuario.email && usuario.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const user = filteredUsuarios.find((usuario) => usuario.email === selectedUserEmail);

  const carregarUsuarios = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/alunos`);
      dispatch(setUsers(response.data || [])); 
    } catch (error) {
      console.error("Error fetching students:", error);
    }
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
        dispatch(fetchUsers()); 
      } else {
        alert('Erro ao atualizar usuário.');
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      alert('Erro ao atualizar usuário. Verifique o console para mais detalhes.');
    }
  };
  
  useEffect(() => {
    carregarUsuarios();
  }, []); 

  useEffect(() => {
    const storedEmail = localStorage.getItem('selectedUserEmail');
    if (storedEmail) {
      setSelectedUserEmail(storedEmail);
    }
  }, []);
  
  return (
    <Container className="mt-4">
       <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <center><div className='back'><h1 style={{fontFamily:'Montserrat', fontSize:'28pt'}}>Gerenciamento de Usuários</h1></div></center>

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
                <tr>
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
      <center><div className='back'><h1 style={{fontFamily:'Montserrat', fontSize:'28pt'}}>Gerenciamento de Empresas</h1></div></center>
      <div className='back1'>
        <div style={{ position: 'relative' }}>
          <Form.Control
            type="text"
            placeholder="Pesquisar por nome ou email da empresa"
            value={searchTermEmpresa}
            onChange={handleEmpresaSearch}
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
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>CNPJ</th>
                
              </tr>
            </thead>
            <tbody>
              {filteredEmpresas.map(empresa => (
                <tr key={empresa.id}>
                  <td>{empresa.nome}</td>
                  <td>{empresa.email}</td>
                  <td>{empresa.cnpj}</td>
            
                  <td className="text-center">
                    <Button variant="light" onClick={() => handleEditEmpresa(empresa.id)}>
                      <img src="https://imgur.com/eIhi3oc.png" alt="Editar" width="24" height="24" />
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteEmpresa(empresa.id)}>
                      <img src="https://imgur.com/WkU1RFZ.png" alt="Excluir" width="24" height="24" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

   
      <Row>
        
          <div className='back1'>
          <center><h6>Adicionar Novo Usuário</h6></center>
          {showAlert && <Alert variant="info">{alertContent}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <h5>Empresa</h5>
              <Form.Control 
                type="text" 
                name="empresa" 
                value={newAluno.empresa} 
                onChange={handleNewAlunoChange}  // <-- Usando a nova função aqui
              />
            </Form.Group>
            <Form.Group>
              <h5>Nome de usuário</h5>
              <Form.Control
                type="text"
                name="username"
                value={newAluno.username}
                onChange={handleNewAlunoChange} // <-- Usando a nova função aqui
                required
              />
            </Form.Group>
            <Form.Group>
              <h5>Primeiro Nome</h5>
              <Form.Control
                type="text"
                name="nome"
                value={newAluno.nome}
                onChange={handleNewAlunoChange} // <-- Usando a nova função aqui
                required
              />
            </Form.Group>
            <Form.Group>
              <h5>Sobrenome</h5>
              <Form.Control
                type="text"
                name="sobrenome"
                value={newAluno.sobrenome}
                onChange={handleNewAlunoChange} // <-- Usando a nova função aqui
                required
              />
            </Form.Group>
            <Form.Group>
              <h5>Email</h5>
              <Form.Control
                type="email"
                name="email"
                value={newAluno.email}
                onChange={handleNewAlunoChange} // <-- Usando a nova função aqui
                required
              />
            </Form.Group>
            <Form.Group>
              <h5>Senha</h5>
              <Form.Control
                type="password"
                name="senha"
                value={newAluno.senha}
                onChange={handleNewAlunoChange} // <-- Usando a nova função aqui
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="btn-suus" style={{ backgroundColor: 'black' }}>
              Adicionar Usuário
            </Button>
          </Form>
        </div>
      
    

      {/* Modal para editar empresa */}
      <Modal size="lg" show={showEmpresaModal} onHide={() => setShowEmpresaModal(false)} dialogClassName="custom-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>Dados da Empresa</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body custom-scroll">
          {editableEmpresa && (
            <Form onSubmit={handleUpdateEmpresa}>
              {/* Campos do formulário para editar os dados da empresa */}
              <Form.Group>
                <h5>CNPJ</h5>
                <Form.Control
                  type="text"
                  name="cnpj"
                  value={editableEmpresa.cnpj}
                  onChange={handleEmpresaChange}
                  required
                />
              </Form.Group>
              {/* ... (outros campos do formulário) */}
              <Button className="btn-suus" variant="primary" style={{ backgroundColor: 'black' }} type="submit">
                Alterar Dados da Empresa
              </Button>
            </Form>  
          )}
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
         

          
            <div className='back1'>
              <center><h6>Cadastrar Nova Empresa</h6></center>
              <Form onSubmit={handleSubmitEmpresa}>
                <Form.Group>
                  <h5>CNPJ</h5>
                  <Form.Control
                    type="text"
                    name="cnpj"
                    value={novaEmpresa.cnpj}
                    onChange={handleEmpresaInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <h5>Nome da Empresa</h5>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={novaEmpresa.nome}
                    onChange={handleEmpresaInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <h5>Logradouro</h5>
                  <Form.Control
                    type="text"
                    name="logradouro"
                    value={novaEmpresa.logradouro}
                    onChange={handleEmpresaInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <h5>Número</h5>
                  <Form.Control
                    type="text"
                    name="numero"
                    value={novaEmpresa.numero}
                    onChange={handleEmpresaInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <h5>Complemento</h5>
                  <Form.Control
                    type="text"
                    name="complemento"
                    value={novaEmpresa.complemento}
                    onChange={handleEmpresaInputChange}
                  />
                </Form.Group>
                <Form.Group>
                  <h5>Bairro</h5>
                  <Form.Control
                    type="text"
                    name="bairro"
                    value={novaEmpresa.bairro}
                    onChange={handleEmpresaInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <h5>Cidade</h5>
                  <Form.Control
                    type="text"
                    name="cidade"
                    value={novaEmpresa.cidade}
                    onChange={handleEmpresaInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <h5>Estado</h5>
                  <Form.Control
                    type="text"
                    name="estado"
                    value={novaEmpresa.estado}
                    onChange={handleEmpresaInputChange}
                    maxLength={255} // Limita o input para 255 caracteres
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <h5>CEP</h5>
                  <Form.Control
                    type="text"
                    name="cep"
                    value={novaEmpresa.cep}
                    onChange={handleEmpresaInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <h5>Telefone</h5>
                  <Form.Control
                    type="text"
                    name="telefone"
                    value={novaEmpresa.telefone}
                    onChange={handleEmpresaInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <h5>Responsável</h5>
                  <Form.Control
                    type="text"
                    name="responsavel"
                    value={novaEmpresa.responsavel}
                    onChange={handleEmpresaInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <h5>Email</h5>
                  <Form.Control
                    type="email"
                    name="email"
                    value={novaEmpresa.email}
                    onChange={handleEmpresaInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <h5>Senha</h5>
                  <Form.Control
                    type="password"
                    name="senha"
                    value={novaEmpresa.senha}
                    onChange={handleEmpresaInputChange}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="btn-suus" style={{ backgroundColor: 'black' }}>
                  Cadastrar Empresa
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
        <Form.Group>
        <h5>ID</h5>
        <Form.Control type="text" value={editableUser.id} readOnly />
      </Form.Group>
      <Form.Group>
        <h5>Empresa</h5>
        <Form.Control type="text" name="empresa" value={editableUser.empresa} onChange={handleInputChange} />
      </Form.Group>
      <Form.Group>
        <h5>Username</h5>
        <Form.Control type="text" name="username" value={editableUser.username} onChange={handleInputChange}/> 
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
      <Form.Group>
        <h5>Role</h5>
        <Form.Control type="text" name="role" value={editableUser.role} onChange={handleUserChange} readOnly/>
      </Form.Group>
     
      {/* Não inclua o campo senha para edição direta. A senha deve ser alterada por meio de um processo específico. */}
      <Button className="btn-suus" variant="primary" style={{ backgroundColor: 'black' }} type="submit">Alterar Dados do Usuário</Button>
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

   {/* Modal para editar empresa */}
   <Modal size="lg" show={showEmpresaModal} onHide={() => setShowEmpresaModal(false)} dialogClassName="custom-modal-content">
        <Modal.Header closeButton>
          <Modal.Title>Dados da Empresa</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body custom-scroll">
          {editableEmpresa && (
            <Form onSubmit={handleUpdateEmpresa}>
              <Form.Group>
                <h5>CNPJ</h5>
                <Form.Control
                  type="text"
                  name="cnpj"
                  value={editableEmpresa.cnpj}
                  onChange={handleEmpresaChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <h5>Nome da Empresa</h5>
                <Form.Control
                  type="text"
                  name="nome"
                  value={editableEmpresa.nome}
                  onChange={handleEmpresaChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <h5>Logradouro</h5>
                <Form.Control
                  type="text"
                  name="logradouro"
                  value={editableEmpresa.logradouro}
                  onChange={handleEmpresaChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <h5>Número</h5>
                <Form.Control
                  type="text"
                  name="numero"
                  value={editableEmpresa.numero}
                  onChange={handleEmpresaChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <h5>Complemento</h5>
                <Form.Control
                  type="text"
                  name="complemento"
                  value={editableEmpresa.complemento}
                  onChange={handleEmpresaChange}
                />
              </Form.Group>
              <Form.Group>
                <h5>Bairro</h5>
                <Form.Control
                  type="text"
                  name="bairro"
                  value={editableEmpresa.bairro}
                  onChange={handleEmpresaChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <h5>Cidade</h5>
                <Form.Control
                  type="text"
                  name="cidade"
                  value={editableEmpresa.cidade}
                  onChange={handleEmpresaChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <h5>Estado</h5>
                <Form.Control
                  type="text"
                  name="estado"
                  value={editableEmpresa.estado}
                  onChange={handleEmpresaChange}
                  maxLength={255}
                  required
                />
              </Form.Group>
              <Form.Group>
                <h5>CEP</h5>
                <Form.Control
                  type="text"
                  name="cep"
                  value={editableEmpresa.cep}
                  onChange={handleEmpresaChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <h5>Telefone</h5>
                <Form.Control
                  type="text"
                  name="telefone"
                  value={editableEmpresa.telefone}
                  onChange={handleEmpresaChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <h5>Responsável</h5>
                <Form.Control
                  type="text"
                  name="responsavel"
                  value={editableEmpresa.responsavel}
                  onChange={handleEmpresaChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <h5>Email</h5>
                <Form.Control
                  type="email"
                  name="email"
                  value={editableEmpresa.email}
                  onChange={handleEmpresaChange}
                  required
                />
              </Form.Group>
              {/* Remova o campo de senha do modal de edição */}
              <Button className="btn-suus" variant="primary" style={{ backgroundColor: 'black' }} type="submit">
                Alterar Dados da Empresa
              </Button>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>

      {/* Modal para confirmar exclusão da empresa */}
      <Modal show={showDeleteEmpresaModal} onHide={cancelDeleteEmpresa}>
        <Modal.Header closeButton>
          <Modal.Title>Excluir Empresa</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza de que deseja excluir esta empresa? Esta ação é irreversível.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDeleteEmpresa}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDeleteEmpresa}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>

    
  );
};

export default AdicionarAlunos;
