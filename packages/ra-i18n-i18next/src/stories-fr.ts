import raMessages from 'ra-language-french';
import { convertRaTranslationsToI18next } from './convertRaTranslationsToI18next';

export default {
    ...convertRaTranslationsToI18next(raMessages),
    resources: {
        posts: {
            name_one: 'Article',
            name_other: 'Articles',
            fields: {
                id: 'Id',
                title: 'Titre',
            },
        },
        comments: {
            name_one: 'Commentaire',
            name_other: 'Commentaires',
            fields: {
                id: 'Id',
                body: 'Message',
            },
        },
    },
};
