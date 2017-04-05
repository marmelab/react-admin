export const CHANGE_LOCALE = 'admin-on-rest/CHANGE_LOCALE';

export const changeLocale = locale => ({
    type: CHANGE_LOCALE,
    payload: locale,
});
