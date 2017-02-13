export const messages = {
    resources: {
        posts: {
            name: 'Article |||| Articles',
            fields: {
                allow_comments: 'Accepte les commentaires ?',
                average_note: 'Note moyenne',
                body: 'Contenu',
                comments: 'Commentaires',
                commentable: 'Commentable',
                created_at: 'Créé le',
                notifications: 'Destinataires de notifications',
                nb_view: 'Nb de vues',
                password: 'Mot de passe (si protégé)',
                pictures: 'Photos associées',
                published_at: 'Publié le',
                teaser: 'Description',
                title: 'Titre',
                views: 'Vues',
            },
        },
        comments: {
            name: 'Commentaire |||| Commentaires',
            fields: {
                body: 'Contenu',
                created_at: 'Créé le',
                post_id: 'Article',
                author: {
                    name: 'Auteur',
                },
            },
        },
    },
    post: {
        list: {
            search: 'Recherche',
        },
        form: {
            summary: 'Résumé',
            body: 'Contenu',
            miscellaneous: 'Extra',
            comments: 'Commentaires',
        },
        edit: {
            title: 'Article "%{title}"',
        },
    },
    comment: {
        list: {
            about: 'Au sujet de',
        },
    },
};

export default messages;
