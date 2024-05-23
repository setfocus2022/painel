import React, { useState, useEffect } from "react";
import axios from 'axios';
import styles from './Register.module.css'; // Note que criamos um novo arquivo CSS para o Register
import backgroundImage1 from './background-1.png';
import backgroundImage2 from './background-2.png';
import backgroundImage3 from './background-3.png';
import icon from './icone.png'; // Importando o ícone

const images = [backgroundImage1, backgroundImage2, backgroundImage3];

function Register() {
  const [usuario, setUsuario] = useState("");


  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [unidade, setUnidade] = useState("");
  const [setor, setSetor] = useState("");
  const [acesso, setAcesso] = useState("");
  const [backgroundIndex, setBackgroundIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBackgroundIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
  
    const user = {usuario, nome, email, senha, unidade, setor, acesso};
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/register_usuario`, user);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  


  const handleDeleteUsers = async () => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/deleteAllUsers`);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <div className={styles.container} style={{backgroundImage: `url(${images[backgroundIndex]})`}}>
      <div className={styles.content}>
        <div className={styles.title}>
          <img src={icon} alt="Icon" className={styles.icon} />
          PsicoFam | Psicossocial
        </div>
        <form onSubmit={handleRegister} className={styles.form}>
        <label>
          Usuário:
          <input type="text" value={usuario} onChange={e => setUsuario(e.target.value)} className={styles.input}/>
        </label>
          <label>
            Nome:
            <input type="text" value={nome} onChange={e => setNome(e.target.value)} className={styles.input}/>
          </label>
          <label>
            Email:
            <input type="text" value={email} onChange={e => setEmail(e.target.value)} className={styles.input}/>
          </label>
          <label>
            Senha:
            <input type="password" value={senha} onChange={e => setSenha(e.target.value)} className={styles.input}/>

          </label>
          <label>
            Unidade:
            <select type="text" value={unidade} onChange={e => setUnidade(e.target.value)} className={styles.input}>
            
            <option value="">Selecione...</option>
              <option value="Lençóis Paulista">Lençóis Paulista</option>
              <option value="Bauru">Bauru</option>
              <option value="Barcarena">Barcarena</option>
              <option value="Ribas">Ribas</option>
            </select>
          </label>
         
          <label>
            Setor:
            <input type="text" value={setor} onChange={e => setSetor(e.target.value)} className={styles.input}/>
          </label>
          <label>
            Acesso:
            <select value={acesso} onChange={e => setAcesso(e.target.value)} className={styles.input}>
              <option value="">Selecione...</option>
              <option value="Administrador">Administrador</option>
              <option value="Visualizador">Visualizador</option>
              <option value="Financeiro">Financeiro</option>
            </select>
          </label>
          <button type="submit" className={styles.button}>Register</button>
        </form>

        <button onClick={handleDeleteUsers} className={styles.button}>Deletar todos os usuários</button>
      </div>
    </div>
  );
}

export default Register;
