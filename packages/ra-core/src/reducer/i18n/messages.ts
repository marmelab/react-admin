import { Reducer } from 'redux';
import {
    CHANGE_LOCALE_SUCCESS,
    ChangeLocaleSuccessAction,
} from '../../actions/index';

type ActionTypes = ChangeLocaleSuccessAction | { type: 'OTHER_ACTION' };

type State = any;

const messagesReducer: Reducer<State> = defaultMessages => {
    return (previousState = defaultMessages, action: ActionTypes) => {
        switch (action.type) {
            case CHANGE_LOCALE_SUCCESS:
                return action.payload.messages;
            default:
                return previousState;
        }
    };
};

export default messagesReducer;
