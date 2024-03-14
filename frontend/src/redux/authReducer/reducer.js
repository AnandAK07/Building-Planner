import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from './actionType'

// Initial State
const intialState = {
    token: '',
    isAuth: false,
    loading: false,
    error: null,
    success: false
}

export const authReducer = (state = intialState, { type, payload }) => {
    switch (type) {
        case LOGIN_REQUEST: return { ...state, loading: true };
        case LOGIN_SUCCESS: return { ...state, loading: false, isAuth: true, success: true, token: payload };
        case LOGIN_FAILURE: return { ...state, loading: false, error: true };
        case LOGOUT: return { ...state, token: '', isAuth: false, success: false }
        default: return state;
    }
}