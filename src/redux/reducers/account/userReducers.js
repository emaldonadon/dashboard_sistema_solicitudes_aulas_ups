export const authReducer = (state = {}, action) => {
    switch (action.type) {
        case 'AUTH_SUCCESS':
            return { loading: false, userInfo: action.payload }
        case 'AUTH_FAIL':
            return { loading: false, error: action.payload }
        case 'AUTH_LOGOUT':
            return {}
        default:
            return state
    }
}
export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case 'USER_LOGIN_REQUEST':
            return { loading: true };
        case 'USER_LOGIN_SUCCESS':
            return { loading: false, userInfo: action.payload };
        case 'USER_LOGIN_FAIL':
            return { loading: false, error: action.payload };
        case 'USER_LOGOUT':
            return {};
        default:
            return state;
    }
};