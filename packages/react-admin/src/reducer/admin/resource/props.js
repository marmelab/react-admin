import { REGISTER_RESOURCE } from '../../../actions';

const initialState = {};
export default (previousState = initialState, action) => {
    switch (action.type) {
        case REGISTER_RESOURCE:
            return action.payload;
        default:
            return previousState;
    }
};
