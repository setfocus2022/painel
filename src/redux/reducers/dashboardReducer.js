
const initialState = {
    alunosCount: 0,
    acessoAlunosCount: 0,
    cursosCount: 0,
    alunosEmpresaCount: 0, // Novo estado
    acessoAlunosEmpresaCount: 0, // Novo estado
    cursosEmpresaCount: 0, // Novo estado
  };
  
  const dashboardReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_ALUNOS_EMPRESA_COUNT':
      return { ...state, alunosEmpresaCount: action.payload };
    case 'SET_ACESSO_ALUNOS_EMPRESA_COUNT':
      return { ...state, acessoAlunosEmpresaCount: action.payload };
    case 'SET_CURSOS_EMPRESA_COUNT':
      return { ...state, cursosEmpresaCount: action.payload };
      case 'SET_ALUNOS_COUNT':
        return { ...state, alunosCount: action.payload };
      case 'SET_ACESSO_ALUNOS_COUNT':
        return { ...state, acessoAlunosCount: action.payload };
      case 'SET_CURSOS_COUNT':
        return { ...state, cursosCount: action.payload };
      default:
        return state;
    }
  };
  
  export default dashboardReducer;
  