import React, { useState, useEffect,useContext  } from 'react'; 
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
  const username = authState.username; // Acessando o username do contexto
  const userId = authState.userId; // Acessando o userId do contexto


  return (
    <div >

      <div className='back-aluno'><h1 className="welcome-message" style={{fontSize:'28pt'}}>Pagina Inicial</h1></div>
      <hr />

     </div>
  );
};

export default PainelUsuario;
