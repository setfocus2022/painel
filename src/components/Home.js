import React, { useState, useEffect } from 'react';
import './Home.css'; // Importe o CSS que acabamos de criar
import headerImg from '../images/background-mulher.jpg';
import logo from '../images/logo2.png'; 
import cursosBackground from '../images/cursos-background.png';
import cursosVrImage from '../images/CursoVR.jpg'; // Ajuste o caminho conforme necessário
import imagemNr from '../images/imagem-nr.jpg'; // Ajuste o caminho conforme necessário
import connectimagem from '../images/conect.png';
import mercadopagoImg from '../images/mercadopago.png';
import sslsecureImg from '../images/sslsecure.png';
import supplyImage from '../images/supply.jpg';
import psicofamImage from '../images/psicofam.png';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import supplyImagePromo from '../images/supplyImagePromo.jpg';
import * as L from 'leaflet';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import './Contact.css';
import certificado from '../images/certificado-de-garantia.png';
import { Container, Row, Col, Card } from 'react-bootstrap';


delete L.Icon.Default.prototype._getIconUrl; 
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(window.innerWidth < 768);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
      function handleResize() {
          setIsMenuVisible(window.innerWidth < 768);
      }

      window.addEventListener('resize', handleResize);

      
      return () => window.removeEventListener('resize', handleResize);
  }, []);
    const position = [-22.60086298617556, -48.80021860313592]; 
 
    return (
        <div style={{marginRight:'0px'}}>
        <nav>
  <div className="menu-wrapper">
    <img src={logo} alt="Logo" className="logo" />
    {isMenuVisible && (
                        <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            &#9776; {}
                        </button>
                    )}
    <ul className={isMenuOpen ? "nav-links open" : "nav-links"}>
      <li><a href="/">Home</a></li>
      <li><a href="/cursos">Cursos</a></li>
      <li><a href="/Login">Login</a></li>
      <li><a href="/CriarConta">Não tem uma conta? Crie uma</a></li>
      {/*    */}
    </ul>
  </div>
</nav>


<header className="nossos-cursos">
            <div className="curso-content">
                <h2 className='header-text1'>Bem vindo a <hr style={{border:'none'}}/> FMATCH CURSOS VIRTUAIS</h2>
                <p style={{fontFamily:'Montserrat', fontWeight:'bold', fontSize:'18pt', marginBottom:'66px'}}>Descubra cursos projetados por especialistas para oferecer aprendizado prático e eficaz.</p>
                <a href="/cursos" style={{fontFamily:'Montserrat', fontWeight:'bold', fontSize:'18pt'}}>Acesse nossa Vitrine</a>
            </div>
            </header>
        

        
       
          <section >

       
    
        <div className="sobre-nos-content" style={{ textAlign: 'center' }}> 
        
           
       

           <p className='promo-text' style={{marginTop:'30px'}}>Nós da Connect Consultoria estamos disponibilizando módulos de treinamento pautado nas atividades de maior relevância dentro do armazém de MRO e a área de compras com um projeto de Cursos Rapidos. Você terá acesso a temas como Gestão de Inventários, Gestão de Recebimento Físico e Fiscal de Mercadorias, Planejamento Estratégico de Reposição dos Estoques com ênfase a Parametrização do MRP , Gestão de Contratos em Compras entre outros Módulos de Treinamento dentro da nossa Plataforma EAD.</p>
          
  

  
      </div>
    
      <div className="wistia_responsive_padding" style={{ padding: "56.25% 0 0 0", position: "relative" , margin:'15px'}}>
    <div className="wistia_responsive_wrapper" style={{ height: "100%", left: 0, position: "absolute", top: 0, width: "100%" }}>
      <div className="wistia_embed wistia_async_awcr6g2vmu seo=true videoFoam=true" style={{ height: "100%", position: "relative", width: "100%" }}>
        <div className="wistia_swatch" style={{ height: "100%", left: 0, opacity: 0, overflow: "hidden", position: "absolute", top: 0, transition: "opacity 200ms", width: "100%" }}>
          <img src="https://fast.wistia.com/embed/medias/awcr6g2vmu/swatch" style={{ filter: "blur(5px)", height: "100%", objectFit: "contain", width: "100%", opacity: imageLoaded ? 1 : 0 }} alt="" aria-hidden="true" onLoad={() => setImageLoaded(true)} />
        </div>
      </div>
    </div>
  </div>


  <h1 style={{position:'center', color:'white',marginTop:'35px', marginBottom:'35px', fontFamily:'Montserrat'}}> Conheça nosso portfólio de produtos e serviços:</h1>
  <div className="sobre-nos-content"> 
 
  
         
            <div className="metaverso-card">
                
                <img src={psicofamImage} alt="PsicoFAM Psicossocial" />
                <div className="text-side" >
                <h2 style={{fontFamily:'Montserrat'}}>PsicoFMATCH: Avaliação Psicossocial</h2>
<p style={{fontFamily:'Montserrat'}}>A PsicoFMATCH é um serviço medico de avaliação psicossocial, acesse e conheça.</p>

                </div>

                
            </div>
         
            <div className="metaverso-card">
        <img src={imagemNr} alt="Treinamentos NR" />
                <div className="text-side">
                <h2>Cursos de Treinamentos NR: Disponível em breve!</h2>
<p>Com nossos cursos de treinamentos NR, você terá a oportunidade de aprofundar seus conhecimentos nas normas regulamentadoras essenciais para garantir a segurança e a saúde no ambiente de trabalho. Estes cursos são projetados para oferecer uma compreensão abrangente das regulamentações, proporcionando aos profissionais as habilidades necessárias para aplicar as melhores práticas em seus campos de atuação. Fique atento para o lançamento desses cursos essenciais e prepare-se para elevar sua carreira a novos patamares com treinamento de qualidade e atualizado.</p>

                </div>
          
            </div>
       
        <div className="metaverso-card">
        <img src={cursosVrImage} alt="Cursos em Metaverso" />
                <div className="text-side">
                    <h2>Cursos em Metaverso: EM PRODUÇÃO</h2>
                    <p>Explore o potencial ilimitado do ensino e aprendizado dentro do Metaverso com nossos cursos inovadores.</p>
                </div>
                
            </div>

            </div>
            
           
            </section>

            <header style={{ backgroundImage: `url(${headerImg})` }}>
            <h1 className='header-text1'>Explore o Futuro do Aprendizado</h1>
            <p style={{fontFamily:'Montserrat', fontWeight:'bold', fontSize:'18pt'}}>Realize a avalição do seu módulo de curso e receba o seu certificado valido!</p>
            <img src={certificado} alt="Certificado" style={{width:'150px', height:'150px'}}/>
           
          </header>
        
           <section>
         <div className="sobre-nos-content">
          <img src={connectimagem} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginBottom:'25px', marginTop:'50px'}} />
         <p className='promo-text'>Na vanguarda da educação industrial, nossa plataforma é dedicada a impulsionar o desenvolvimento profissional dentro de indústrias e usinas. Com um portfólio diversificado de cursos online, estamos empenhados em ajudá-lo a alcançar seus objetivos educacionais e profissionais. Destacamos especialmente nossos treinamentos Supply Chain, cadeia de suprimentos (Compras e Estoque) divido por módulos. Ofereçemos serviços de Avaliação Médica Psicossocial em uma plataforma Online PSICO FMATCH. Em breve disponibilizaremos Treinamentos de Normas Regulamentadoras (NR), oferecendo um catálogo sempre atualizado e alinhado às necessidades do setor. Além disso, estamos produzindo uma inovadora série de cursos em realidade virtual. Esses treinamentos no Metaverso, acessíveis via óculos VR para celulares, prometem revolucionar a capacitação em segurança e operações industriais, oferecendo uma experiência imersiva e eficaz. Fique conosco para explorar essa nova dimensão de aprendizado, onde a tecnologia VR abre portas para um treinamento mais dinâmico e engajador.</p>
     
        </div>

         
        </section> 
        <section className="contact-wrapper" id="contact-section">
      <div className="contact-info">
        <h2>Nosso Contato</h2>
        <p>R. Cel. Joaquim Gabriel, 521</p>
        <p>Sala 2 Centro - Lençóis Paulista - SP, 18682-030</p>
        <div className="social-links">
          <a href="" target="_blank" rel="noreferrer">
            <FaFacebook size={32} color="#FFFFFF" />
          </a>
          <a href="" target="_blank" rel="noreferrer">
            <FaInstagram size={32} color="#FFFFFF" />
          </a>
          <a href="" target="_blank" rel="noreferrer">
            <FaLinkedin size={32} color="#FFFFFF" />
          </a>
          <a href="" target="_blank" rel="noreferrer">
            <FaYoutube size={32} color="#FFFFFF" />
          </a>
        </div>
      </div>
      <div className="map-container">
        <div className="map-wrapper">
          <MapContainer center={position} zoom={15} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position} icon={new L.Icon.Default()}>
              <Popup>
              FMATCH
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </section>
           <footer>
                <div className="payment-icons">
                    <img src={mercadopagoImg} alt="Mercado Pago" />
                    <img src={sslsecureImg} alt="SSL Secure" />
                </div>
                <p>© 2024 FMATCH. Todos os direitos reservados.</p>
            </footer>

        </div>
      );
    }
    

export default Home;
