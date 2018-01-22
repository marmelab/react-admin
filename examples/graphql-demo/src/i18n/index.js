import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';

import customFrenchMessages from './fr';
import customEnglishMessages from './en';

export default {
    fr: { ...frenchMessages, ...customFrenchMessages },
    en: { ...englishMessages, ...customEnglishMessages },
};
