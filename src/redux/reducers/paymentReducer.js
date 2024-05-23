// src/reducers/paymentReducer.js

const initialState = {
    status: 'idle', // 'idle', 'pending', 'approved', 'error'
};

const paymentReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PAYMENT_STATUS':
            return {
                ...state,
                status: action.payload,
            };
        default:
            return state;
    }
};

export default paymentReducer;
