import React, { useState, useEffect } from 'react';  // Acrescentamos o useEffect
import './Home.css'; // Reutilize o CSS da Home se aplicável
import logo from '../images/logo2.png'; // Caminho para o logo
import cursosBackground from '../images/cursos-background.png';
import mercadopagoImg from '../images/mercadopago.png';
import sslsecureImg from '../images/sslsecure.png';
import { ToastContainer, toast } from 'react-toastify'; 
import ImageCarrinho from '../images/carrinho-de-compras.png'; // Ajuste o caminho conforme necessário
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { Badge, Button, Container, Row, Col, Card } from 'react-bootstrap'; // Importe Col aqui
import cursosData from './CursosFMATCH.json';
import './Cursos.css';
import axios from 'axios';
import headerImg from '../images/background-mulher.jpg';
import certificado from '../images/certificado-de-garantia.png';
import './Home.css';

function Curso() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(window.innerWidth < 768);

    useEffect(() => {
        function handleResize() {
            setIsMenuVisible(window.innerWidth < 768);
        }

        window.addEventListener('resize', handleResize);

        // Limpa o event listener ao desmontar o componente
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState(cursosData);
    // Inicializa o estado selectedCourses como um array vazio
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [courseCount, setCourseCount] = useState(0);
    const [showModal, setShowModal] = useState(false);

    // Função para abrir o modal
    const openModal = () => {
      setShowModal(true);
    };
    // Função para fechar o modal
    const closeModal = () => {
      setShowModal(false);
    };
    // Função para redirecionar para a tela de criação de conta
    const redirectToCreateAccount = () => {
      window.location.href = '/CriarConta';
    };
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [cursosOriginais, setCursosOriginais] = useState([]);
    const [selectedPriceOptions, setSelectedPriceOptions] = useState({});
    const [selectedOriginalCourses, setSelectedOriginalCourses] = useState([]);
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

    useEffect(() => {
      setCursosOriginais(cursosData);
    }, []);
      
      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isSubmitEnabled) return;
      
        // Mapeia os cursos selecionados para o formato esperado pelo Mercado Pago
        const items = selectedOriginalCourses.map(courseId => {
          const curso = cursosOriginais.find(curso => curso.id === courseId);
          return {
            title: curso.nome,
            unit_price: Number(selectedPriceOptions[courseId].replace(',', '.')), // Assegura conversão correta
            quantity: 1,
          };
        });
      
        try {
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/checkout`, { items });
          const checkoutURL = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${response.data.id}`;
          window.open(checkoutURL, '_blank'); // Abre o checkout em uma nova aba
        } catch (error) {
          
          toast.error("Erro ao processar o pagamento. Por favor, tente novamente.");
        }
      };
      
      
      const redirectToLogin = () => {
        window.location.href = '/login';
      };
      
      
    return (
        <div>
          <nav>
  <div className="menu-wrapper">
    <img src={logo} alt="Logo" className="logo" />
    {isMenuVisible && (
                        <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            &#9776; {/* Ícone de hambúrguer */}
                        </button>
                    )}
    <ul className={isMenuOpen ? "nav-links open" : "nav-links"}>
      <li><a href="/">Home</a></li>
      <li><a href="/cursos">Cursos</a></li>
      <li><a href="/Login">Login</a></li>
      <li><a href="/CriarConta">Não tem uma conta? Crie uma</a></li>
   
      {/* Outros links conforme necessário */}
    </ul>
  </div>
</nav>
            <header className="nossos-cursos" style={{ backgroundImage: `url(${cursosBackground})` , marginBottom:'-35px' }}>
            <div className="curso-content">
      
        <p style={{fontFamily:'Montserrat', fontWeight:'bold', fontSize:'28pt'}}>Explore os cursos que temos a oferecer</p>
         <p style={{fontFamily:'Montserrat', fontWeight:'bold', fontSize:'18pt'}}>com Certificados válidos</p>
            <img src={certificado} alt="Certificado" style={{width:'150px', height:'150px'}}/> </div>
      </header>
      <section>
  <div className='body-cursos' style={{ backgroundColor:'#15283E',marginBottom:'5px' , alignContent:'center', margin:'15px 0px 15px 0px'}}>

 

  <h2 style={{fontFamily:'Montserrat',color:'white', marginTop:'25px'}}>CURSOS-WEB ORIGINAIS FMATCH</h2>

  </div>
  <Row className="user-profile-row" >
    {cursosOriginais.map((curso) => (
      <Card className="programa-card" key={curso.id} style={{width:'450px'}}>
        <Card.Img variant="top" style={{height:'auto'}} src={curso.thumbnail} />
        <Card.Body>
          <Card.Title>{curso.nome}</Card.Title>
          <Card.Text className="card-text-container">
            {curso.descricao}
          </Card.Text>
          <Card.Text className="periodo-acesso-explicacao">
          <strong>Como funciona o período de acesso?</strong><br />
          Após a compra do curso, a contagem do período de acesso é iniciada <strong>ao você abrir o módulo pela primeira vez ( 10 dias de acesso )</strong>. Ao concluir o Curso, <strong>você terá acesso a 2 visualizações de "Revisão" da Aula, após isso o acesso será revogado e você precisará comprar novamente.</strong>
</Card.Text>
          {/* Incluindo os valores abaixo da descrição */}
          <div className="valores-cursos" style={{backgroundColor:'#14253A', borderRadius:'5px'}}>
          <p style={{fontFamily:'Montserrat', fontWeight:'bold', color:'White'}}>Acesso e Valor</p>
            <p style={{fontFamily:'Montserrat', fontWeight:'bold', color:'White'}}>10 dias - 2 revisões após conclusão - R$ {curso.valor_10d}</p>
          </div>
          <Button onClick={openModal} className='botao-aula' style={{ marginTop:'25px',  fontWeight:'bold'}}>Saiba Mais</Button>
        </Card.Body>
      </Card>
    ))}
  </Row>



      <Container>
      <ToastContainer />
     
  
      <hr style={{ border: 'none', height: '2px', backgroundColor: 'white', margin: '20px 0' }} />

      <h2 style={{fontFamily:'Montserrat', fontWeight:'bold',marginTop:'35px', color:'white'}}>Cursos de Treinamentos NR: DISPONIVEL EM BREVE!</h2>
     
      
      

   
    </Container>
    


    
      </section>

      <header style={{ backgroundImage: `url(${headerImg})` }}>
            <h1 className='header-text1'>Explore o Futuro do Aprendizado</h1>
            <p style={{fontFamily:'Montserrat', fontWeight:'bold', fontSize:'18pt'}}>Crie uma conta e faça sua compra dentro da nossa plataforma!</p>
        
           
          </header>
          
      <footer>
                <div className="payment-icons">
                    <img src={mercadopagoImg} alt="Mercado Pago" />
                    <img src={sslsecureImg} alt="SSL Secure" />
                </div>
                <p>© 2024 FMATCH. Todos os direitos reservados.</p>
            </footer>

            <Modal show={showModal} onHide={closeModal} className='modal-centered'>
  
    <Modal.Title style={{fontFamily: 'Montserrat', fontWeight: 'bold', textAlign: 'center', fontSize: '18pt'}}>
      Se interessou no nosso módulo de treinamento?
    </Modal.Title>
 
  <Modal.Body style={{fontSize: '15pt', fontFamily: 'Montserrat', textAlign: 'center'}}>
    Crie uma conta e faça sua compra dentro da nossa plataforma
  </Modal.Body>
  <Modal.Footer className="d-flex justify-content-center">
  <Button variant="secondary" onClick={redirectToLogin} className='botao-aula' style={{ fontWeight:'bold', margin:'5px'}} >
    Login
  </Button>
  <Button variant="primary" onClick={redirectToCreateAccount} className='botao-aula' style={{ fontWeight:'bold'}}>
    Criar Conta
  </Button>
</Modal.Footer>

</Modal>

    </div>
  );
}

export default Curso;
