import englishMessages from './i18n/en';
import { GET_DEFAULT_MESSAGES, GET_LOCALE_MESSAGES } from 'react-admin';

const messages = {
    en: () => englishMessages,
    fr: () => import('./i18n/fr.js').default
};

export default (type, params) => {
    if(GET_DEFAULT_MESSAGES=== type){
        return englishMessages;
    }
    if(GET_LOCALE_MESSAGES === type){
        return messages[params.locale]();
    }
    throw new Error('Undefined action type', type);
}