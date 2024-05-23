import { 
    FETCH_USERS, UPDATE_USER, SET_PURCHASE_STATUS, SET_CURSOS_ACESSO,
    SET_CURSOS_COMPRADOS, SET_TIME_LEFT, SET_ATTEMPTS, RESET_EVALUATION, 
    SET_SELECTED_CURSO, SET_USERNAME, SET_USER_DETAILS, CLEAR_USER_DETAILS, 
    SET_AVALIACAO_RESPOSTAS, SET_CURSOS_COMPRADOSCATALOGO, SET_RECOVERY_STAGE, 
    SET_RECOVERY_EMAIL, SET_RECOVERY_CODE, RESET_RECOVERY_STATE,
    SET_USERS_EMPRESA // Adicionar a nova action type aqui
  } from '../types';

const initialState = {
    users: [],
    user: {},
    usersEmpresa: [], 
    purchaseStatus: '',
    cursosComprados: [],
    cursosCompradosCatalogo: [],
    timeLeft: 1800, // 30 minutos em segundos
    attempts: 0,
    selectedCursoId: null,
    userDetails: {},
    username: '', // Adicionado username aqui
    token: null,
    role: null,
    userId: null,
    avaliacaoRespostas: {},
    certificadoLoading: true,
    certificadoData: null,
    recoveryStage: 1,
    recoveryEmail: '',
    recoveryCode: '',
    
};


const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USERS_EMPRESA:
            return { ...state, usersEmpresa: action.payload };
           
        case SET_RECOVERY_STAGE:
            return {
                ...state,
                recoveryStage: action.payload
            };
        case SET_RECOVERY_EMAIL:
            return {
                ...state,
                recoveryEmail: action.payload
            };
        case SET_RECOVERY_CODE:
            return {
                ...state,
                recoveryCode: action.payload
            };
        case RESET_RECOVERY_STATE:
            return {
                ...state,
                recoveryStage: 1,
                recoveryEmail: '',
                recoveryCode: ''
            };
        
        case 'SET_CERTIFICADO_LOADING':
    return {
        ...state,
        certificadoLoading: action.payload,
    };

    case 'SET_CERTIFICADO_DATA':
        return {
            ...state,
            certificadoData: action.payload,
    };
        case 'SET_AVALIACAO_RESPOSTAS':
            return {
                ...state,
                avaliacaoRespostas: action.payload,
            };
        case 'CLEAR_USER_DETAILS':
            return {
                ...state,
                token: null,
                username: null,
                role: null,
                userId: null,
            };
            case SET_USER_DETAILS:
                return {
                    ...state,
                    userDetails: action.payload,
                };
        case SET_USERNAME:
            return {
              ...state,
              username: action.payload,
            };
        case SET_SELECTED_CURSO:
            return {
              ...state,
              selectedCursoId: action.payload,
            };
        case SET_TIME_LEFT:
            return {
              ...state,
              timeLeft: action.payload,
            };
          case SET_ATTEMPTS:
            return {
              ...state,
              attempts: state.attempts + 1,
            };
          case RESET_EVALUATION:
            return {
                ...state,
                timeLeft: initialState.timeLeft,
                attempts: initialState.attempts,
                avaliacaoRespostas: initialState.avaliacaoRespostas,
            };
        case SET_CURSOS_ACESSO:
            return {
                ...state,
                cursosComprados: state.cursosComprados.map(curso => {
                const cursoAcesso = action.payload.find(acesso => acesso.curso_id === curso.id);
                return {
                    ...curso,
                    data_inicio_acesso: cursoAcesso ? cursoAcesso.data_inicio_acesso : null,
                    data_fim_acesso: cursoAcesso ? cursoAcesso.data_fim_acesso : null
                };
                })
            };

        case SET_CURSOS_COMPRADOS:
            return {
                ...state,
                cursosComprados: action.payload.map(curso => ({
                    ...curso,
                    // Certifique-se de que acessos_pos_conclusao esteja sendo configurado aqui
                    acessos_pos_conclusao: curso.acessos_pos_conclusao || 0,
                })),
            };
            case SET_CURSOS_COMPRADOSCATALOGO:
                return {
                    ...state,
                    cursosCompradosCatalogo: action.payload
                };
        case FETCH_USERS:
            return {
                ...state,
                users: action.payload
            };
        case UPDATE_USER:
            // Atualize o estado conforme necessário
            return {
                ...state,
                user: action.payload
            };
        case SET_PURCHASE_STATUS:
            return {
                ...state,
                purchaseStatus: action.payload
            };
        default:
            return state;
            
    }
};

export default userReducer;
