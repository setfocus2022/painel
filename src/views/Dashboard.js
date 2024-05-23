import React, { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';
import {
  getAlunosCadastradosCount,
  getAcessoAlunosCount,
  getCursosCadastradosCount,
} from '../redux/actions/dashboardActions';
import './styles.dashboard.scss';
import Financeiro from './Financeiro.js';


const Dashboard = () => {
  const dispatch = useDispatch();
  const { alunosCount, acessoAlunosCount, cursosCount } = useSelector((state) => state.dashboard);
  const { username } = useSelector(state => state.user.userDetails);

  useEffect(() => {
    dispatch(getAlunosCadastradosCount());
    dispatch(getAcessoAlunosCount());
    dispatch(getCursosCadastradosCount());
  }, [dispatch]);




  return (
    <Container fluid>
      <center><div className='back-prof'><h1 style={{fontFamily:'Montserrat', fontSize:'28pt'}}>Seja bem-vindo {username}</h1></div></center>
      <Row className="mb-4 d-flex justify-content-center">
        <Col className='text-center card-btn h-100'>
          <h5>Usuários Cadastrados</h5>
          <Card.Text>Total de cadastros</Card.Text>
          <Card.Text className="display-4">{alunosCount}</Card.Text>
        </Col>
        <Col className='text-center card-btn h-100'>
          <h5>Acesso dos Usuários</h5>
          <Card.Text>Até o momento</Card.Text>
          <Card.Text className="display-4">{acessoAlunosCount}</Card.Text>
        </Col>
       
      </Row>
      
    </Container>
  );
}

export default Dashboard;
