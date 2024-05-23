// CartButton.js
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import ImageCarrinho from '../../images/carrinho-de-compras.png'; // Caminho para o ícone do carrinho
import { useSelector } from 'react-redux'; // Importe o hook useSelector

function CartButton({ onOpenModal }) {
  const history = useHistory();
  const location = useLocation();
  const courseCount = useSelector(state => state.user.cursosComprados.length); // Substitua pelo seu seletor correto

  const handleCartClick = () => {
    if (location.pathname === '/usuario/LojaCursos') {
      onOpenModal(); // Função passada como prop para abrir o modal
    } else {
      history.push('/usuario/LojaCursos'); // Redireciona para a rota de loja de cursos
    }
  };

  return (
    <Button onClick={handleCartClick} className="cart-btn">
      <img src={ImageCarrinho} alt="Carrinho" style={{ width: '20px', height: '20px' }} />
      {courseCount > 0 && <span className="cart-count">{courseCount}</span>}
    </Button>
  );
}

export default CartButton;
