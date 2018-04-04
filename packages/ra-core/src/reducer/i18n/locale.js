import { DEFAULT_LOCALE } from '../../i18n/index';
import { CHANGE_LOCALE_SUCCESS } from '../../actions/localeActions';

export default (initialLocale = DEFAULT_LOCALE) => (
    previousLocale = initialLocale,
    { type, payload }
) => {
    switch (type) {
        case CHANGE_LOCALE_SUCCESS:
            return payload.locale;
        default:
            return previousLocale;
    }
};
