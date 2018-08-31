import frenchMessages from 'ra-language-french';
import treeFrenchMessages from 'ra-tree-language-french';
import { mergeTranslations } from 'react-admin';

export default {
    simple: {
        action: {
            close: 'Fermer',
            resetViews: 'Réinitialiser des vues',
        },
        'create-post': 'Nouveau post',
    },
    ...mergeTranslations(frenchMessages, treeFrenchMessages),
    resources: {
        posts: {
            name: 'Article |||| Articles',
            fields: {
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
                tags: 'Catégories',
                title: 'Titre',
                views: 'Vues',
                authors: 'Auteurs',
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
            name: 'User |||| Users',
            fields: {
                name: 'Name',
                role: 'Role',
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
