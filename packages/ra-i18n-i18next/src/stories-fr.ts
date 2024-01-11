import raMessages from 'ra-language-french';

export default {
    ...raMessages,
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
