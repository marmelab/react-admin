import { Reducer } from 'redux';
import {
    CHANGE_LOCALE,
    CHANGE_LOCALE_SUCCESS,
    CHANGE_LOCALE_FAILURE,
    ChangeLocaleAction,
    ChangeLocaleSuccessAction,
    ChangeLocaleFailureAction,
} from '../../actions/localeActions';

type ActionTypes =
    | ChangeLocaleAction
    | ChangeLocaleSuccessAction
    | ChangeLocaleFailureAction
    | { type: 'OTHER_ACTION' };

type State = boolean;

const loadingReducer: Reducer<State> = (
    loading = false,
    action: ActionTypes
) => {
    switch (action.type) {
        case CHANGE_LOCALE:
            return true;
        case CHANGE_LOCALE_SUCCESS:
        case CHANGE_LOCALE_FAILURE:
            return false;
        default:
            return loading;
    }
};

export default loadingReducer;
