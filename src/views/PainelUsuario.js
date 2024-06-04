import React, { useState, useEffect, useContext } from 'react';
import { Badge, Button, Container, Row, Card, Modal } from 'react-bootstrap';
import cursosData from './cursos.json';
import axios from 'axios';
import './PainelUsuario.css';
import courseThumbnail from '../images/courseThumbnail.jpg';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { AuthContext } from '../context/AuthContext';
import { setSelectedCurso } from '../redux/actions/userActions';
import { format, parseISO } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

const PainelUsuario = () => {
  const { authState } = useContext(AuthContext);
  const username = authState.username;
  const userId = authState.userId;

  const iframeHtml = '<iframe title="ficha de EPI" width="600" height="373.5" src="https://app.powerbi.com/view?r=eyJrIjoiOTcyZGZmNTctYTIxZC00MTZiLWE4MzQtMDdkYzgwMzE2Y2Y0IiwidCI6IjY0OGI0ZDE4LTJiMjgtNDY5Mi05OWU3LWEzYjVmMzlkZjg1NyJ9" frameborder="0" allowFullScreen="true"></iframe>';

  return (
    <div>
      <div className='back-aluno'>
        <h1 className="welcome-message" style={{ fontSize: '28pt' }}>
          Pagina Inicial
        </h1>
      </div>
      <hr />

      <div className="power-bi-container"> 
      <div dangerouslySetInnerHTML={{ __html: iframeHtml }} />
    </div>
    </div>
  );
};

export default PainelUsuario;