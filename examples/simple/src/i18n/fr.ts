import frenchMessages from 'ra-language-french';

export default {
    simple: {
        action: {
            close: 'Fermer',
            resetViews: 'Réinitialiser des vues',
        },
        'create-post': 'Nouveau post',
    },
    ...frenchMessages,
    resources: {
        posts: {
            name: 'Article |||| Articles',
            fields: {
                average_note: 'Note moyenne',
                body: 'Contenu',
                category: 'Catégorie',
                comments: 'Commentaires',
                commentable: 'Commentable',
                commentable_short: 'Com.',
                created_at: 'Créé le',
                notifications: 'Destinataires de notifications',
                nb_view: 'Nb de vues',
                password: 'Mot de passe (si protégé)',
                pictures: 'Photos associées',
                'pictures.url': 'URL',
                'pictures.metas.authors': 'Auteurs',
                'pictures.metas.authors.name': 'Nom',
                authors: 'Auteurs',
                'authors.user_id': 'Nom',
                'authors.role': 'Rôle',
                published_at: 'Publié le',
                teaser: 'Description',
                tags: 'Catégories',
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
        users: {
            name: 'Utilisateur |||| Utilisateurs',
            fields: {
                name: 'Nom',
                role: 'Rôle',
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
    user: {
        list: {
            search: 'Recherche',
        },
        form: {
            summary: 'Résumé',
            security: 'Sécurité',
        },
        edit: {
            title: 'Utilisateur "%{title}"',
        },
    },
};
