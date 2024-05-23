import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card, Table } from "react-bootstrap";
import './UserProfile.css'; // Certifique-se de que este é o caminho correto para o seu arquivo CSS
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from "../context/AuthContext";
function UserProfile() {
  const { authState } = useContext(AuthContext);
  const userId = authState.userId; // Acessando o userId do contexto
  const username = authState.username;
  
  const [userData, setUserData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    endereco: '',
    cidade: '',
    pais: '',
    cep: ''
  });

  // Função para lidar com a submissão do formulário
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const username = authState.username;
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
            userId,
            ...userData
        });
  
        if (response.data.success) {
            toast.success('Perfil atualizado com sucesso!');
            // Lógica adicional, como redirecionamento, se necessário
        } else {
            toast.error('Erro ao atualizar perfil: ' + response.data.message);
        }
    } catch (error) {
        toast.error('Erro ao enviar dados do perfil: ' + error.message);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/profile/${username}`);
        if (response.data.success) {
          setUserData(response.data.data);
        } else {
          console.error('Erro ao buscar dados do usuário');
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUserData();
  }, [username]);




  return (
    <Container fluid className="user-profile-container" >
         <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
         <div className='back-aluno'><h1 className="welcome-message" style={{fontSize:'28pt'}}>Meu Perfil</h1></div>
      <hr />
      <Row className="user-profile-row">
        <div className="profile-edit">
          <h4 className="profile-title">Editar Perfil</h4>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col md={12}>
                <Form.Group>
                  <label style={{fontFamily:'Montserrat', color:'white'}}>Nome de Usuário</label>
                  <Form.Control
                    value={username}
                    type="text"
                    readOnly
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <label style={{fontFamily:'Montserrat', color:'white'}}htmlFor="exampleInputEmail1">Endereço de Email</label>
                  <Form.Control
                    value={userData.email}
                    placeholder="Email"
                    type="email"
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group>
                  <label style={{fontFamily:'Montserrat', color:'white'}}>Primeiro Nome</label>
                  <Form.Control
                    value={userData.nome}
                    placeholder="Primeiro Nome"
                    type="text"
                    readOnly
    
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <label style={{fontFamily:'Montserrat', color:'white'}}>Sobrenome</label>
                  <Form.Control
                    value={userData.sobrenome}
                    placeholder="Sobrenome"
                    type="text"
                    readOnly
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group>
                  <label style={{fontFamily:'Montserrat', color:'white'}}> Endereço</label>
                  <Form.Control
                    value={userData.endereco}
                    placeholder="Endereço Residencial"
                    type="text"
                    onChange={(e) => setUserData({ ...userData, endereco: e.target.value })}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group>
                  <label style={{fontFamily:'Montserrat', color:'white'}}>Cidade</label>
                  <Form.Control
                    value={userData.cidade}
                    placeholder="Cidade"
                    type="text"
                    onChange={(e) => setUserData({ ...userData, cidade: e.target.value })}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <label style={{fontFamily:'Montserrat', color:'white'}}>País</label>
                  <Form.Control
                    value={userData.pais}
                    placeholder="País"
                    type="text"
                    onChange={(e) => setUserData({ ...userData, pais: e.target.value })}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <label style={{fontFamily:'Montserrat', color:'white'}}>Código Postal</label>
                  <Form.Control
                    value={userData.cep}
                    placeholder="CEP"
                    type="text"
                    onChange={(e) => setUserData({ ...userData, cep: e.target.value })}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Button
                className="btn-suus pull-right"
                type="submit"
                variant="info"
                style={{ backgroundColor: '#1F1F1F', fontFamily:'Montserrat', color:'white', fontWeight:'bold'}} 
            >
                Atualizar Perfil
            </Button>
            <div className="clearfix"></div>
          </Form>
        </div>
        <div className="profile-user">
          <div className="profile-image">
            <img
              alt="..."
              src="https://imgur.com/yMRSWvw.png" // substituir pela URL real da imagem
            ></img>
          </div>
          <div className="author">
            <hr />
            <h5 className="profile-title">{username}</h5>
          </div>
        </div>
      </Row>



    </Container>
  );
}

export default UserProfile;
