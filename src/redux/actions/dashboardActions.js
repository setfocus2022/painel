import axios from 'axios';

// Action para buscar o total de cursos da empresa
export const getCursosEmpresaCount = (empresaNome) => async (dispatch) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/empresa/cursos/total`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userDetails') ? JSON.parse(localStorage.getItem('userDetails')).token : null}`
      }
    });
    dispatch({ type: 'SET_CURSOS_EMPRESA_COUNT', payload: response.data.totalCursos });
  } catch (error) {
    console.error('Erro ao buscar total de cursos da empresa:', error);
  }
};

export const fetchUsersEmpresa = (empresaNome) => async (dispatch) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/alunos/empresa/${empresaNome}`);
    // Correção: Disparar a action diretamente
    dispatch({ type: 'SET_USERS_EMPRESA', payload: response.data || [] }); 
  } catch (error) {
    console.error("Error fetching students:", error);
  }
};
// Action para buscar a quantidade de alunos da empresa logada
export const getAlunosEmpresaCount = (empresaNome) => async (dispatch) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/alunos/empresa/${empresaNome}/count`);
    dispatch({ type: 'SET_ALUNOS_EMPRESA_COUNT', payload: response.data.count });
  } catch (error) {
    console.error('Erro ao buscar total de alunos da empresa:', error);
  }
};

// Action para buscar a quantidade de alunos da empresa logada que mudaram a senha
export const getAcessoAlunosEmpresaCount = (empresaNome) => async (dispatch) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/alunos/empresa/${empresaNome}/password-changed/count`);
    dispatch({ type: 'SET_ACESSO_ALUNOS_EMPRESA_COUNT', payload: response.data.count });
  } catch (error) {
    console.error('Erro ao buscar total de acessos de alunos da empresa:', error);
  }
};

export const getAlunosCadastradosCount = () => async (dispatch) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/alunos/count`);
    dispatch({ type: 'SET_ALUNOS_COUNT', payload: response.data.count });
  } catch (error) {
    console.error('Erro ao buscar total de alunos:', error);
  }
};

export const getAcessoAlunosCount = () => async (dispatch) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/alunos/password-changed/count`);
    dispatch({ type: 'SET_ACESSO_ALUNOS_COUNT', payload: response.data.count });
  } catch (error) {
    console.error('Erro ao buscar total de acessos de alunos:', error);
  }
};

export const getCursosCadastradosCount = () => async (dispatch) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cursos/count`);
    dispatch({ type: 'SET_CURSOS_COUNT', payload: response.data.count });
  } catch (error) {
    console.error('Erro ao buscar total de cursos:', error);
  }
};
