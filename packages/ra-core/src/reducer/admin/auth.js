import { USER_LOGIN_SUCCESS, USER_LOGOUT } from '../../actions';

const initialState = { isLoggedIn: false };

export default (previousState = initialState, action) => {
    switch (action.type) {
        case USER_LOGIN_SUCCESS:
            return { ...previousState, isLoggedIn: true };
        case USER_LOGOUT:
            return { ...previousState, isLoggedIn: false };
    }

    return previousState;
};

export const isLoggedIn = state => state.isLoggedIn;
