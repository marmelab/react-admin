export const CHANGE_LOCALE = 'RA/CHANGE_LOCALE';
export const CHANGE_LOCALE_SUCCESS = 'RA/CHANGE_LOCALE_SUCCESS';
export const CHANGE_LOCALE_FAILURE = 'RA/CHANGE_LOCALE_FAILURE';

export const changeLocale = locale => ({
    type: CHANGE_LOCALE,
    payload: locale,
});

export const changeLocaleSuccess = (locale, messages) => ({
    type: CHANGE_LOCALE_SUCCESS,
    payload: {
        locale,
        messages,
    },
});

export const changeLocaleFailure = (locale, error) => ({
    type: CHANGE_LOCALE_FAILURE,
    error,
    payload: {
        locale,
    },
});
