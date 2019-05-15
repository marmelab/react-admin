import { Reducer } from 'redux';
import { DEFAULT_LOCALE } from '../../i18n/index';
import {
    CHANGE_LOCALE_SUCCESS,
    ChangeLocaleSuccessAction,
} from '../../actions/localeActions';

type ActionTypes = ChangeLocaleSuccessAction | { type: 'OTHER_ACTION' };

type State = string;

export default (initialLocale: string = DEFAULT_LOCALE): Reducer<State> => (
    previousLocale = initialLocale,
    action: ActionTypes
) => {
    switch (action.type) {
        case CHANGE_LOCALE_SUCCESS:
            return action.payload.locale;
        default:
            return previousLocale;
    }
};
