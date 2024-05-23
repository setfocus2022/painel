import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Image } from 'react-bootstrap';
import axios from 'axios';
import { useHistory, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setRecoveryStage, setRecoveryEmail, setRecoveryCode, resetRecoveryState } from '../redux/actions/userActions';
import './UserLogin.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const PasswordRecovery = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Get state from Redux store
  const recoveryStage = useSelector(state => state.user.recoveryStage);
  const recoveryEmail = useSelector(state => state.user.recoveryEmail);
  const recoveryCode = useSelector(state => state.user.recoveryCode);

 
 const [newPassword, setNewPassword] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); 
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/check-email`, { email: recoveryEmail });
      if (response.data.success) {
        toast.success('E-mail encontrado. Código enviado.');
        dispatch(setRecoveryStage(2)); // Update stage in Redux store
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Erro ao enviar código de verificação.');
    } finally {
      setIsSubmitting(false); // Reabilita o botão após a conclusão
    }
  };
  const handleCodeVerification = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/verify-code`, { email: recoveryEmail, code: recoveryCode });
      if (response.data.success) {
        dispatch(setRecoveryStage(3));
        toast.success('Código verificado. Prossiga para redefinir sua senha.');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Codigo Incorreto, verifique o codigo enviado no e-mail.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handlePasswordReset = async (e) => {
    e.preventDefault();
  
    if (!newPassword || !confirmPassword) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
  
    if (!passwordRegex.test(newPassword)) {
      toast.error("A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um caractere especial.");
      return;
    }
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/update-password`, {
        email: recoveryEmail, 
        newPassword
      });
  
      if (response.data.success) {
        toast.success("Senha atualizada com sucesso. Redirecionando para a tela de login.");
        dispatch(resetRecoveryState()); 
        history.push('/login');
      
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Erro ao redefinir a senha.');
    }
  };
  
  // Renderiza diferentes conteúdos baseados no estágio
  return (
    <Container fluid className="d-flex align-items-center justify-content-center login-container">
      <ToastContainer position="top-right" />
      <Row className="flex-grow-1">
        <Col md={6} className="login-section-wrapper">
          <div className="brand-wrapper">
            <Image src="https://imgur.com/97hX0ve.png" alt="logo" className="logologin" />
          </div>
          <div className="login-wrapper my-auto">
            <h1 className="login-title">Recuperação de Senha</h1>
        
              <Form onSubmit={handleEmailSubmit} className="login-form">
  {recoveryStage === 1 && (
    <>
      <Form.Group>
        <Form.Label>Digite seu E-mail:</Form.Label>
        <Form.Control type="email" value={recoveryEmail} onChange={(e) => dispatch(setRecoveryEmail(e.target.value))} required />
      </Form.Group>
      <center><Button type="submit" className="login-button" style={{ backgroundColor: 'black' }} disabled={isSubmitting}>Enviar Código</Button></center>
    </>
  )}
</Form>

{recoveryStage === 2 && (
  <Form onSubmit={(e) => handleCodeVerification(e, dispatch, recoveryEmail, recoveryCode, toast.error)} className="login-form">
    <Form.Group>
      <Form.Label>Digite o código enviado no E-Mail:</Form.Label>
      <Form.Control type="text" value={recoveryCode} onChange={(e) => dispatch(setRecoveryCode(e.target.value))} required />
    </Form.Group>
    <center><Button type="submit" className="login-button" style={{ backgroundColor: 'black' }} disabled={isSubmitting}>Verificar Código</Button></center>
  </Form>
)}

{recoveryStage === 3 && (
  <Form onSubmit={handlePasswordReset} className="login-form">
    <Form.Group>
      <Form.Label>Nova senha:</Form.Label>
      <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
    </Form.Group>
    <Form.Group>
      <Form.Label>Repetir senha:</Form.Label>
      <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
    </Form.Group>
    <center><Button type="submit" className="login-button" style={{ backgroundColor: 'black' }}>Alterar Senha</Button></center>
  </Form>
)}
               <a href="/login" className="forgot-password-link">Voltar a tela de login</a>
              </div>
     
        </Col>
        <Col md={6} className="px-0 d-none d-md-block coluna-imagem login-img">
</Col>
      </Row>
    </Container>
  );
};
export default PasswordRecovery;