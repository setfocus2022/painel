import React from 'react';
import trabalhadorImg from '../images/trabalhador.png'; // Importe a imagem
import './DemoPage.css'; // Certifique-se de importar o arquivo CSS correto

const Demo = () => {
  return (
    <div className="container-demo">
      <img src={trabalhadorImg} alt="Trabalhador" className="image-trabalhador" /> {/* Adicione a tag <img> */}
      <h6 className='h6'>Está página ainda está em construção !</h6>
    </div>
  );
};

export default Demo;
