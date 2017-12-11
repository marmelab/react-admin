import englishMessages from './i18n/en';
import { createMessagesProvider } from 'react-admin';

export default createMessagesProvider(
    {
        en: englishMessages,
        fr: () => import('./i18n/fr').then(m => m.default),
    },
    englishMessages
);
