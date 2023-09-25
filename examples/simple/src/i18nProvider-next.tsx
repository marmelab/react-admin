import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import i18nextProvider, { convertRaMessagesToI18next } from 'ra-i18n-i18next';
import englishMessages from './i18n/en';

const instance = i18n.use(initReactI18next);

// TODO: remove
export default i18nextProvider(instance, {
    resources: {
        en: { translation: convertRaMessagesToI18next(englishMessages) },
    },
});
