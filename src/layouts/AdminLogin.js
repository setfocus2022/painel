import React, { useState } from "react";
import axios from 'axios';
import styles from './Login.module.css';
import icon from './icone.png';
import NotificationAlert from "react-notification-alert"; // Import the notification component

const Login = (props) => {
  const [identificador, setIdentificador] = useState(""); // Mudança aqui
  const [senha, setSenha] = useState("");
  const notificationAlertRef = React.useRef(null); // Reference for notification

  // Function to show notification
  const notify = (message, type) => {
    const options = {
      place: "tr",
      message: message,
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API_URL}/login`, { identificador, senha }) // Mudança aqui
      .then(response => {
        console.log('Response from server:', response.data); // Log the response from the server

        if (response.data.success) {
          notify("Credenciais Corretas!", "success");
          localStorage.setItem('instituicaoNome', response.data.instituicaoNome);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('username', identificador);
          console.log('Instituição Nome:', response.data.instituicaoNome);
          localStorage.setItem('role', response.data.role);
          console.log('Instituição Nome:', response.data.instituicaoNome);

          console.log('Role after login:', localStorage.getItem('role')); // Log the role after login

          props.history.push('/admin/dashboard');
        } else {
          
          notify("Credenciais Incorretas!", "danger"); // Notify failure
       
        
        }
      })
      .catch(error => {
        if (error.response && (error.response.status === 404 || error.response.status === 401)) {
          notify("Credenciais Incorretas!", "danger"); // Notify failure for 404 or 401 errors
        } else {
          console.error('An unexpected error occurred:', error);
        }
      });
  };

  return (
    <div>
    <NotificationAlert ref={notificationAlertRef} /> 
     
    <div className={styles.container} style={{ backgroundImage: 'url(https://imgur.com/fGJp4XO.png)', backgroundSize: 'cover', Height: '100vh' }}>
      <div className={styles.content}>
        <div className={styles.title}>
        <img src="https://imgur.com/F7oe830.png" style={{ width: '100%', height: 'auto', marginBottom: '5px' }} alt="logo" />
        <hr style={{ borderTop: '1px solid #ccc', marginBottom: '20px' }} />
          <div className={styles.text}>
            FMATCH | Painel Administrativo
          </div>
          <div style={{ height: '20px' }}></div>
        </div>
        <form onSubmit={handleLogin} className={styles.form}>
          <input type="text" value={identificador} onChange={(e) => setIdentificador(e.target.value)} placeholder="E-Mail" className={styles.input}/> {/* Mudança aqui */}
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha" className={styles.input}/>
          <button type="submit" className={styles.button}>Login</button>
        </form>
      </div>
    </div>
    </div>
    
  );
};

export default Login;