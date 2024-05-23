import Dashboard from "views/Dashboard.js";
import AdicionarAlunos from "views/NovoAluno.js";

import PainelUsuario from "views/PainelUsuario.js";
import Config from "views/Configuracoes.js";
import User from "views/UserProfile.js";
import DemoPage from "views/DemoPage.js";

import PainelEmpresa from "views/PainelEmpresa.js";
import AlunoEmpresa from "views/AlunoEmpresa.js";
import CursosEmpresas from "views/CursosEmpresas.js";


const dashboardRoutes = [
  {
    path: "/painel", // Rota do painel da empresa
    name: "Painel",
    icon: "nc-icon nc-chart-bar-32", // Ícone para a rota
    component: PainelEmpresa,
    layout: "/empresa", // Layout da empresa
    roles: ['Empresa'] // Role da empresa
  },
  {
    name: "Cadastro",
    icon: "nc-icon nc-single-02",
    layout: "/empresa", // Layout da empresa
    path: "/alunos", // Rota para a página AlunoEmpresa.js
    component: AlunoEmpresa,
    roles: ['Empresa'], // Role da empresa
  },
  {
    path: "/cursos",
    name: "Cursos",
    icon: "nc-icon nc-ruler-pencil",
    component: CursosEmpresas,
    layout: "/empresa",
    roles: ['Empresa']
  },

 

  {
    path: "/dashboard",
    name: "Painel",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin",
    roles: ['Admin']
  },


  {
    path: "/inicio",
    name: "Inicio",
    component: PainelUsuario,
    layout: "/usuario",
    icon: " nc-icon nc-spaceship",
    roles: ['Aluno']
  },
  {
    name: "Gerenciamento",
    icon: "nc-icon nc-single-02",
    layout: "/admin",
    path: "/AdicionarAlunos",
    component: AdicionarAlunos,
    roles: ['Admin'], 
  },
  /*
  {
    name: "Instituições",
    icon: "nc-icon nc-bank",
    layout: "/admin",
    roles: ['Dev'], 
    subMenu: [
      {
        
        path: "/NovaInstituicao",
        name: "Nova Instituição",
        component: NR4,
        layout: "/admin",
        roles: ['Dev'],
      
      },
      {
        path: "/GerenciarInstituicao",
        name: "Gerenciar Instituição",
        component: GerenciamentoInstituicao, // Import this at the top of the file
        layout: "/admin",
        roles: [ 'Dev'],
      },
    ]
  },
  */

  {
        
    path: "/Perfil",
    name: "Meu Perfil",
    component: User,
    icon: "nc-icon nc-badge",
    layout: "/usuario",
    roles: ['Aluno'],
      
  },
   
 


];

export default dashboardRoutes;