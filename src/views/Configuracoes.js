import React, { useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import axios from 'axios';
import './PainelUsuario.css'; 

const Config = () => {


  const username = localStorage.getItem('username');
  
  return (
    <Container>
      <Row className="mb-4">
        <h1 className="welcome-message">Seja bem vindo {username}.</h1>
      </Row>
      <hr />
    </Container>
  );
};

export default Config;