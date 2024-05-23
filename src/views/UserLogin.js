import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Image } from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import NotificationAlert from "react-notification-alert";
import './UserLogin.css'; // Certifique-se de que este é o caminho correto para o seu arquivo CSS
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Caminho para o seu AuthContext

const Login = () => {
  

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const notificationAlertRef = React.useRef(null);
  const { setAuthInfo } = useContext(AuthContext);

  const notify = (message, type) => {
    const options = {
      place: "tr",
      message: message,
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API_URL}/api/user/login`, { Email: email, senha: senha })
      .then((response) => {
        if (response.data.success) {
          // Salvando os detalhes do usuário e o token no localStorage
          localStorage.setItem('userDetails', JSON.stringify({
            token: response.data.token,
            role: response.data.role,
            username: response.data.username,
            userId: response.data.userId,
       
          }));
  
          // Atualizar o contexto de autenticação
          setAuthInfo({
            token: response.data.token,
            role: response.data.role,
            username: response.data.username,
            userId: response.data.userId,
          });
  
          // Redirecionamento com base na role
          if (response.data.role === "Aluno") {
            history.push("/usuario/inicio");
          } else if (response.data.role === "Admin") {
            history.push("/admin/dashboard");
          } else if (response.data.role === "Empresa") { // Nova role
            history.push("/empresa/painel"); // Redirecionar para o painel da empresa
          }
        } else {
          notify("Credenciais Incorretas!", "danger");
        }
      })
      .catch(error => {
        if (error.response && (error.response.status === 404 || error.response.status === 401)) {
          notify("Credenciais Incorretas!", "danger");
        } else {
          console.error('An unexpected error occurred:', error);
        }
      });
  };
  

  return (
    <div>
      <NotificationAlert ref={notificationAlertRef} />
      <Container fluid className="d-flex align-items-center justify-content-center login-container">
        <div className="row flex-grow-1">
          <div className="col-md-6 login-section-wrapper">
            <div className="brand-wrapper">
              <img src="https://imgur.com/97hX0ve.png" alt="logo" className="logologin"  />
            </div>
            <div className="login-wrapper my-auto">
            <h1 className="login-title">LOGIN</h1>
              <Form className="login-form">
                <Form.Group>
                <Form.Label>Usuário ou E-mail:</Form.Label>
                <Form.Control type="text" value={email} onChange={(e) => setEmail(e.target.value)} />

                </Form.Group>
                <Form.Group>
                
                  <Form.Label>Senha:</Form.Label>
                  <Form.Control type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
                </Form.Group>
                {error && <div className="alert alert-danger">{error}</div>}
                <center><Button type="submit" className="login-button" style={{ backgroundColor: 'black' }} onClick={handleLogin} block>Login</Button></center>

              </Form>
              <a href="/recuperar-senha" className="forgot-password-link">Esqueci minha senha</a>
             
              <hr style={{ border: 'none' }} />
              <a href="/" className="forgot-password-link">Voltar ao site</a>
            </div>
          </div>
          <div className="col-md-6 px-0 d-none d-md-block coluna-imagem">
            <img src="https://imgur.com/janbOnj.png" alt="login background" className="login-img" />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;
