import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Col } from 'react-bootstrap';
import axios from 'axios';
import './UserLogin.css'; // Reutilizando o arquivo CSS de UserLogin

const PrimeiroAcesso = () => {
  useEffect(() => {
    document.body.style.backgroundColor = "#000"; // Define a cor de fundo como preta

    // Função de limpeza para remover a cor de fundo quando o componente é desmontado
    return () => {
      document.body.style.backgroundColor = null;
    };
  }, []);

  const [Email, setEmail] = useState('');
  const [Senha, setSenha] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  const verifyUser = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/verifyUser`, { Email });
      console.log("Resposta da API: ", response.data);
  
      if (response.data.success) {
        console.log("Usuário verificado com sucesso. Atualizando estado 'verified'.");
        setVerified(true);
      } else {
        console.log("Falha na verificação do usuário.");
        setError('Identificador incorreto.');
      }
    } catch (error) {
      console.log("Erro ao fazer a chamada da API: ", error);
      setError('Erro ao verificar usuário');
    }
  };

  const registerPassword = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/registerPassword`, { Email, Senha });
      if (response.data.success) {
        window.location.href = '/UserLogin'; // Redireciona para a página de login
      } else {
        setError('Erro ao cadastrar senha');
      }
    } catch (error) {
      console.log('Erro ao fazer a chamada da API: ', error);
      setError('Erro ao cadastrar senha');
    }
  };

  return (
    <div>
      <Container fluid className="d-flex align-items-center justify-content-center login-container">
        <div className="row flex-grow-1">
          <div className="col-md-6 login-section-wrapper">
            <div className="brand-wrapper">
              <img src="https://imgur.com/97hX0ve.png" alt="logo" className="logo" />
            </div>
            <div className="login-wrapper my-auto">
              <div className='primeiroacesso'>Primeiro acesso? Informe seu e-mail abaixo e prossiga com o cadastro da sua senha</div>
              <h1 className="login-title">{!verified ? 'Primeiro Acesso' : 'Cadastro de Senha'}</h1>
              <Form className="login-form">
                {!verified ? (
                  <>
                    <Form.Group>
                      <Form.Label className="form-label">Email:</Form.Label>
                      <Form.Control type="text" value={Email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>
                    <center>
                      <Button className="login-button" type="submit" onClick={verifyUser}>Verificar</Button>
                    </center>
                  </>
                ) : (
                  <>
                    <Form.Group>
                      <Form.Label className="form-label">Senha:</Form.Label>
                      <Form.Control type="password" value={Senha} onChange={(e) => setSenha(e.target.value)} />
                    </Form.Group>
                    <center>
                      <Button className="login-button" onClick={registerPassword}>Cadastrar senha</Button>
                    </center>
                  </>
                )}
                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
              </Form>
              <hr style={{ border: 'none' }} />
              <a href="/login" className="forgot-password-link">Voltar a tela de login</a>
            </div>
          </div>
          <div className="col-md-6 px-0 d-none d-md-block">
            <img src="https://imgur.com/eETvmkm.png" alt="login background" className="login-img" />
          </div>
        </div>
      </Container>
    </div>
  );
};
export default PrimeiroAcesso;
