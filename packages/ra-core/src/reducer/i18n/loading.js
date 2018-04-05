import {
    CHANGE_LOCALE,
    CHANGE_LOCALE_SUCCESS,
    CHANGE_LOCALE_FAILURE,
} from '../../actions/localeActions';

export default (loading = false, action) => {
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
