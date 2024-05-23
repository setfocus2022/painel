import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

import './styles.financeiro.scss';

const Financeiro = () => {
  const history = useHistory();

  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth() + 1); // Inicializa com o mês atual

  const [chartData, setChartData] = useState({
    labels: ['Amadeu', 'Felipe', 'Matheus', 'Caixa da Empresa'],
    datasets: [
      {
        data: [40, 40, 10, 10],
        backgroundColor: ['#FF7F00', '#AA5400', '#070D14', '#15283E'],
        hoverBackgroundColor: ['#FF7F00', '#AA5400', '#070D14', '#15283E'],
      },
    ],
  });

  const [totalLucro, setTotalLucro] = useState(0);
  const [showBarChart, setShowBarChart] = useState(true);
  const [barChartData, setBarChartData] = useState({
    labels: ['Amadeu', 'Felipe', 'Matheus', 'Caixa da Empresa'],
    datasets: [
      {
        label: 'Lucro por Sócio',
        data: [0, 0, 0, 0], // Dados iniciais zerados
        backgroundColor: ['#FF7F00', '#AA5400', '#070D14', '#15283E'],
        borderColor: ['#FF7F00', '#AA5400', '#070D14', '#15283E'],
        borderWidth: 1,
      },
    ],
  });

  const barChartOptions = {
    indexAxis: 'y',
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Lucro por Sócio (R$)',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Lucro (R$)',
        },
      },
    },
  };

  const fetchLucroTotal = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/financeiro/lucro-total?mes=${mesSelecionado}`);
      const data = response.data.totalLucro;
  
      setTotalLucro(data);
  
      // Resetando os dados do gráfico para os valores iniciais
      setChartData({
        labels: ['Amadeu', 'Felipe', 'Matheus', 'Caixa da Empresa'],
        datasets: [
          {
            data: [40, 40, 10, 10], // Os valores originais
            backgroundColor: ['#FF7F00', '#AA5400', '#070D14', '#15283E'],
            hoverBackgroundColor: ['#FF7F00', '#AA5400', '#070D14', '#15283E'],
          },
        ],
      });
  
      // Distribuição do lucro pelos sócios
      const distribuicao = [0.4, 0.4, 0.1, 0.1].map(porcentagem => data * porcentagem);
  
      setBarChartData({
        labels: ['Amadeu', 'Felipe', 'Matheus', 'Caixa da Empresa'],
        datasets: [{
          label: 'Lucro por Sócio',
          data: distribuicao,
          backgroundColor: ['#FF7F00', '#AA5400', '#070D14', '#15283E'],
          borderColor: ['#FF7F00', '#AA5400', '#070D14', '#15283E'],
          borderWidth: 1,
        }],
      });
    } catch (error) {
      console.error('Erro ao buscar o total de lucro:', error);
    }
  };
  

  const fetchEstatisticasVendas = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/vendas/estatisticas?mes=${mesSelecionado}`); // Adicionando o parâmetro mês
      const dados = response.data;
  
      const nomesCursos = dados.map(d => d.nome);
      const quantidades = dados.map(d => d.quantidade);
  
      // Atualiza o gráfico de pizza com os nomes dos cursos e quantidades
      setChartData({
        labels: nomesCursos,
        datasets: [{
          data: quantidades,
          backgroundColor: ['#FF7F00', '#AA5400', '#070D14', '#15283E'],
          hoverBackgroundColor: ['#FF7F00', '#AA5400', '#070D14', '#15283E'],
        }],
      });
  
      // Atualiza o gráfico de barras com os mesmos dados
      setBarChartData({
        labels: nomesCursos,
        datasets: [{
          label: 'Quantidade de Vendas por Curso',
          data: quantidades,
          backgroundColor: ['#FF7F00', '#AA5400', '#070D14', '#15283E'],
          borderColor: ['#FF7F00', '#AA5400', '#070D14', '#15283E'],
          borderWidth: 1,
        }],
      });
  
    } catch (error) {
      console.error('Erro ao buscar estatísticas de vendas:', error);
    }
  };
  
  const fetchCursosIniciadosConcluidos = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cursos/iniciados-concluidos?mes=${mesSelecionado}`); // Adicionando o parâmetro mês
      const dados = response.data;
  
      const nomesCursos = dados.map(d => d.nome + ' (' + d.status + ')');
      const quantidades = dados.map(d => d.quantidade);
  
      // Atualiza o gráfico de pizza e o gráfico de barras
      setChartData({
        labels: nomesCursos,
        datasets: [{
          data: quantidades,
          backgroundColor: ['#FF7F00', '#AA5400', '#070D14', '#15283E'],
          hoverBackgroundColor: ['#FF7F00', '#AA5400', '#070D14', '#15283E'],
        }],
      });
  
      setBarChartData({
        labels: nomesCursos,
        datasets: [{
          label: 'Quantidade de Cursos por Status',
          data: quantidades,
          backgroundColor: ['#FF7F00', '#AA5400', '#070D14', '#15283E'],
          borderColor: ['#FF7F00', '#AA5400', '#070D14', '#15283E'],
          borderWidth: 1,
        }],
      });
  
    } catch (error) {
      console.error('Erro ao buscar cursos iniciados e concluídos:', error);
    }
  };
  
  useEffect(() => {
    fetchLucroTotal();
  }, [mesSelecionado]); // Chamada automática ao carregar o componente e ao mudar o mês

  return (
    <Container fluid>
      <Row className="justify-content-center align-items-center my-4">
        <Col md={4} className="d-flex flex-column align-items-center">
          {/* Os botões estão aqui para alterar os dados do gráfico conforme necessário */}
          <Button variant="outline-primary" className="custom-btn mb-2" onClick={() => fetchLucroTotal()}>Lucro entre Socios</Button>

          <Button variant="outline-info" className="custom-btn mb-2" onClick={fetchEstatisticasVendas}>Estatísticas de Vendas</Button>

          <Button variant="outline-info" className="custom-btn mb-2" onClick={fetchCursosIniciadosConcluidos}>Cursos Iniciados</Button>
      
        
        </Col>
        <Col md={6} lg={4}>
          <h2 className="text-center mb-4">Gráfico em Tempo Real</h2>
          <Doughnut data={chartData} />
        </Col>
      </Row>
      <Row className="justify-content-center my-4">
        <Col className="info-column">
         <div style= {{backgroundColor:'#15283E', borderRadius:'5px', marginTop:'20px', width:'100%'}} >
           <p className="text-total">Total de lucro bruto: <span style={{ color: 'green' }}>{totalLucro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>   *não incluido taxa Mercado Pago</p>
           
          </div> 
            {/* Dropdown para selecionar o mês */}
            <select value={mesSelecionado} style={{ marginTop:'10px' }} onChange={(e) => setMesSelecionado(parseInt(e.target.value))}>
            <option value="1">Janeiro</option>
            <option value="2">Fevereiro</option>
            <option value="3">Março</option>
            <option value="4">Abril</option>
            <option value="5">Maio</option>
            <option value="6">Junho</option>
            <option value="7">Julho</option>
            <option value="8">Agosto</option>
            <option value="9">Setembro</option>
            <option value="10">Outubro</option>
            <option value="11">Novembro</option>
            <option value="12">Dezembro</option>
          </select>
          <Bar data={barChartData} options={barChartOptions} />
        </Col>
      </Row>
    </Container>
  );
};

export default Financeiro;