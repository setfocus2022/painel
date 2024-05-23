import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Image } from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

const NovaSenha = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  // Get email from Redux store (assuming you stored it there)
  const recoveryEmail = useSelector(state => state.user.recoveryEmail);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("As senhas não coincidem.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/update-password`, { email: recoveryEmail, newPassword });
      if (response.data.success) {
        setMessage('Senha redefinida com sucesso.');
        history.push('/login'); // Redirect to login page
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage('Erro ao redefinir a senha.');
    }
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center login-container">
      <Row className="flex-grow-1">
        <Col md={6} className="login-section-wrapper">
          <Card className="login-wrapper my-auto">
            <Card.Body>
              <h1 className="login-title">Redefinir Senha</h1>
              <Form onSubmit={handlePasswordReset}>
                <Form.Group>
                  <Form.Label>Nova senha:</Form.Label>
                  <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Repetir senha:</Form.Label>
                  <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </Form.Group>
                <Button type="submit" className="login-button">Alterar Senha</Button>
              </Form>
            </Card.Body>
          </Card>
          {message && <Alert variant="info">{message}</Alert>}
        </Col>
        <Col md={6} className="d-none d-md-block">
          <Image src="https://imgur.com/eETvmkm.png" alt="login background" className="login-img" />
        </Col>
      </Row>
    </Container>
  );
};

export default NovaSenha;