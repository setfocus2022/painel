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

  const iframeHtml = '<iframe title="ficha de EPI" width="600" height="373.5" src="https://app.powerbi.com/view?r=eyJrIjoiOTcyZGZmNTctYTIxZC00MTZiLWE4MzQtMDdkYzgwMzE2Y2Y0IiwidCI6IjY0OGI0ZDE4LTJiMjgtNDY5Mi05OWU3LWEzYjVmMzlkZjg1NyJ9" frameborder="0" allowFullScreen="true"></iframe>';



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
      <div className="power-bi-container"> 
      <div dangerouslySetInnerHTML={{ __html: iframeHtml }} />
    </div>
    </Container>
  );
}

export default Dashboard;
