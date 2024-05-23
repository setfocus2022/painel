import React, { createContext, useState, useContext } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity, value, image) => {  // Adicione o parâmetro image
    const newItem = { product, quantity, value, image };  // Inclua a imagem aqui
    setCartItems(prevItems => [...prevItems, newItem]);
  };

  const removeFromCart = (product) => {
    setCartItems(prevItems => prevItems.filter(item => item.product !== product));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
