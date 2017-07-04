import {
    SHOW_NOTIFICATION,
    HIDE_NOTIFICATION,
} from '../../actions/notificationActions';

const defaultState = {
    text: '',
    type: 'info', // one of 'info', 'confirm', 'warning'
};

export default (previousState = defaultState, { type, payload }) => {
    switch (type) {
        case SHOW_NOTIFICATION:
            return { text: payload.text, type: payload.type };
        case HIDE_NOTIFICATION:
            return { ...previousState, text: '' };
        default:
            return previousState;
    }
};
