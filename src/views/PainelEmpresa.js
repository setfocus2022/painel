import React, { useEffect, useContext } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';
import {
  getAlunosEmpresaCount,
  getAcessoAlunosEmpresaCount,
  getCursosEmpresaCount,
} from '../redux/actions/dashboardActions';
import './styles.dashboard.scss';
import Financeiro from './Financeiro.js';
import { AuthContext } from '../context/AuthContext';

const PainelEmpresa = () => {
  const dispatch = useDispatch();
  const { alunosEmpresaCount, acessoAlunosEmpresaCount, cursosEmpresaCount } = useSelector((state) => state.dashboard);
  const { username } = useSelector(state => state.user.userDetails);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    dispatch(getAlunosEmpresaCount(authState.username));
    dispatch(getAcessoAlunosEmpresaCount(authState.username));
    dispatch(getCursosEmpresaCount(authState.username));
  }, [dispatch, authState.username]);

  // Dados para o gráfico de pizza (ajuste conforme necessário)
  const data = {
    labels: ['Amadeu', 'Felipe', 'Marcos', 'Matheus'],
    datasets: [
      {
        data: [40, 40, 10, 10], // porcentagens para cada pessoa
        backgroundColor: ['#FF7F00', '#AA5400', '#0E1A29', '#15283E'],
        hoverBackgroundColor: ['#FF7F00', '#AA5400', '#0E1A29', '#15283E'],
      },
    ],
  };

  return (
    <Container className="mt-4">
      <center>
        <div className='back' style={{ marginBottom: '25px' }}>
          <h1 style={{ fontFamily: 'Montserrat', fontSize: '28pt' }}>Seja Bem-vindo</h1>
        </div>
      </center>
      <Row className="mb-4 d-flex justify-content-center">
        <Col className='text-center card-btn h-100'>
          <h5>Alunos Cadastrados</h5>
          <Card.Text>total de cadastros</Card.Text>
          <Card.Text className="display-4">{alunosEmpresaCount}</Card.Text>
        </Col>
        <Col className='text-center card-btn h-100'>
          <h5>Acesso dos Alunos</h5>
          <Card.Text>até o momento</Card.Text>
          <Card.Text className="display-4">{acessoAlunosEmpresaCount}</Card.Text>
        </Col>
        <Col className='text-center card-btn h-100'>
          <h5>Cursos Adquiridos</h5> {/* Título atualizado */}
          <Card.Text>total de cursos adquiridos</Card.Text> {/* Texto atualizado */}
          <Card.Text className="display-4">{cursosEmpresaCount}</Card.Text>
        </Col>
      </Row>
    
    </Container>
  );
};

export default PainelEmpresa;