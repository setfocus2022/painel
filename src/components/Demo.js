import React from 'react';
import { useHistory } from 'react-router-dom';
import './Demo.css';

const Demo = () => {
  const history = useHistory();

  // Função para lidar com o clique no botão
  const handleButtonClick = () => {
    history.push('/login'); // Redireciona para a rota /login
  };

  return (
    <div className="container-demo">
      <h6 className='h6'>Está página é a vitrine da EAD. Ainda está em construção</h6>
      <button className="button-demo" onClick={handleButtonClick}>Acessar Página de Login</button>
    </div>
  );
};

export default Demo;
