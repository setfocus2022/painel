import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom'; // Se não estiver usando a versão 6, use useHistory.

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const history = useHistory(); // useHistory ao invés de useNavigate.
  const [authState, setAuthState] = useState({
    token: null,
    role: null,
    username: null,
    userId: null,
    expiresAt: null,
  });

  const setAuthInfo = (authInfo) => {
    localStorage.setItem('userDetails', JSON.stringify(authInfo)); // Salva as informações atualizadas no localStorage.
    setAuthState(authInfo);
  };

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails && userDetails.token) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/validateToken`, { 
        headers: { Authorization: `Bearer ${userDetails.token}` } 
      }).then((response) => {
        if (response.data.role !== userDetails.role ||
            response.data.username !== userDetails.username ||
            response.data.userId !== userDetails.userId) {
          localStorage.removeItem('userDetails');
          setAuthState({
            token: null,
            role: null,
            username: null,
            userId: null,
            expiresAt: null,
          });
          history.push('/login');
        } else {
          setAuthState(userDetails);
        }
      }).catch((error) => {
        localStorage.removeItem('userDetails');
        setAuthState({
          token: null,
          role: null,
          username: null,
          userId: null,
          expiresAt: null,
        });
        history.push('/login');
      });
    }
  }, [history]);
  
  

  // Verifique a expiração do token em cada renderização
  useEffect(() => {
    const interval = setInterval(() => {
      if (authState.expiresAt && new Date() > new Date(authState.expiresAt)) {
        console.log('Token expirado');
        setAuthState({
          token: null,
          role: null,
          username: null,
          userId: null,
          expiresAt: null,
        });
        localStorage.removeItem('userDetails');
        history.push('/login');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [authState]);

  return (
    <AuthContext.Provider value={{ authState, setAuthInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
