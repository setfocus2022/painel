import { 
  FETCH_USERS, UPDATE_USER, SET_PURCHASE_STATUS, SET_CURSOS_ACESSO,
  SET_CURSOS_COMPRADOS, SET_TIME_LEFT, SET_ATTEMPTS, RESET_EVALUATION, 
  SET_SELECTED_CURSO, SET_USERNAME, SET_USER_DETAILS, CLEAR_USER_DETAILS, 
  SET_AVALIACAO_RESPOSTAS, SET_CURSOS_COMPRADOSCATALOGO, SET_RECOVERY_STAGE, 
  SET_RECOVERY_EMAIL, SET_RECOVERY_CODE, RESET_RECOVERY_STATE,
  SET_USERS_EMPRESA // Adicionar a nova action type aqui
} from '../types';
import axios from 'axios';

export const fetchUsers = () => async dispatch => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/alunos`);
        dispatch({
            type: FETCH_USERS,
            payload: response.data
        });
    } catch (error) {
        console.error("Error fetching students:", error);
        // Trate o erro conforme necessário
    }
};

export const updateUser = (userData) => async dispatch => {
    try {
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/user/profileEdit`, userData);
        dispatch({
            type: UPDATE_USER,
            payload: response.data
        });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        // Trate o erro conforme necessário
    }
};
export const setUsers = users => {
    return {
        type: 'SET_USERS',
        payload: users
    };
};


// Ação para atualizar o status da compra
export const setPurchaseStatus = (status) => {
    return {
        type: SET_PURCHASE_STATUS,
        payload: status
    };
};
export const setCursosComprados = (cursosComprados) => {
    return {
        type: SET_CURSOS_COMPRADOS,
        payload: cursosComprados.map(curso => ({
            ...curso,
            acessos_pos_conclusao: 0 // valor padrão, atualizado pelo backend
          }))
    };
};
export const setCursosCompradosCatalogo = (cursosCompradosCatalogo) => {
    return {
        type: SET_CURSOS_COMPRADOSCATALOGO,
        payload: cursosCompradosCatalogo
    };
};
// Ação para definir os dados de acesso dos cursos comprados
export const setCursosAcesso = (cursosAcesso) => {
    return {
      type: 'SET_CURSOS_ACESSO',
      payload: cursosAcesso
    };
  };
export const setTimeLeft = (time) => ({
type: SET_TIME_LEFT,
payload: time,
});

export const incrementAttempts = () => ({
    type: SET_ATTEMPTS,
    payload: 1, // Incrementa por 1
  });
  
  export const resetEvaluation = () => ({
    type: RESET_EVALUATION,
  });

  export const setSelectedCurso = (cursoId) => {
    return {
        type: 'SET_SELECTED_CURSO',
        payload: cursoId
    };
    
};
export const setUsername = (username) => {
    return {
      type: 'SET_USERNAME',
      payload: username,
    };
  };
  export const setUserDetails = (details) => {
    return {
        type: 'SET_USER_DETAILS',
        payload: details,
    };
};
export const clearUserDetails = () => {
    return {
        type: 'CLEAR_USER_DETAILS'
    };
};
export const setAvaliacaoRespostas = (respostas) => {
    return {
      type: 'SET_AVALIACAO_RESPOSTAS',
      payload: respostas,
    };
  };
export const setCertificadoLoading = (isLoading) => {
    return {
        type: 'SET_CERTIFICADO_LOADING',
        payload: isLoading,
};
};

export const setCertificadoData = (pdfData) => {
    return {
        type: 'SET_CERTIFICADO_DATA',
        payload: pdfData,
    };
};
// Definir o estágio do processo de recuperação de senha
export const setRecoveryStage = (stage) => {
    return {
        type: SET_RECOVERY_STAGE,
        payload: stage
    };
};

// Definir o e-mail para o processo de recuperação de senha
export const setRecoveryEmail = (email) => {
    return {
        type: SET_RECOVERY_EMAIL,
        payload: email
    };
};

// Definir o código de verificação para o processo de recuperação de senha
export const setRecoveryCode = (code) => {
    return {
        type: SET_RECOVERY_CODE,
        payload: code
    };
};

// Resetar o estado de recuperação de senha
export const resetRecoveryState = () => {
    return {
        type: RESET_RECOVERY_STATE
    };
};