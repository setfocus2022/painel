import React from "react";
import ReactDOM from "react-dom/client";

import { Provider as ReduxProvider } from 'react-redux'; // Renomeado para evitar confusão com outros Providers
import store from './redux/store'; // Certifique-se de que o caminho esteja correto

import 'react-toastify/dist/ReactToastify.css';



import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
// Importações dos estilos globais
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import 'leaflet/dist/leaflet.css';
import './App.css';
import './assets/css/custom.css';
// Importações dos componentes do site

import AdminLayout from "layouts/Admin.js";
import UserLogin from "views/UserLogin.js";


import CreateAccount from "views/CreateAccount.js";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { AuthProvider } from './context/AuthContext'; 
import PasswordRecovery from "views/PasswordRecovery";
import NovaSenha from "views/NovaSenha"; 
import Empresa from "layouts/Empresa.js";
const root = ReactDOM.createRoot(document.getElementById("root"));


root.render(
 
  <ReduxProvider store={store}>
    
    <BrowserRouter>
    <AuthProvider>
      <Switch>
        <Route path="/admin" component={AdminLayout} />
      
        <Route path="/usuario" component={AdminLayout} />
        <Route path="/Login" component={UserLogin} />
        <Route path="/CriarConta" component={CreateAccount} />
        <Route path="/empresa" component={Empresa} /> 
        <Route path="/recuperar-senha" component={PasswordRecovery} />
        <Route path="/NovaSenha" component={NovaSenha} />
       
        <Redirect from="*" to="/Login" />
      </Switch>
      </AuthProvider>
    </BrowserRouter>
    
    </ReduxProvider>
 
);

