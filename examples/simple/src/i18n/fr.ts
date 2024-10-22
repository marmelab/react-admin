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
                nb_comments: 'Nb de commentaires',
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
            notifications: {
                created: 'Article créé |||| %{smart_count} articles créés',
                updated:
                    'Article mis à jour |||| %{smart_count} articles mis à jour',
                deleted:
                    'Article supprimé |||| %{smart_count} articles supprimés',
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
            notifications: {
                created:
                    'Commentaire créé |||| %{smart_count} commentaires créés',
                updated:
                    'Commentaire mis à jour |||| %{smart_count} commentaires mis à jour',
                deleted:
                    'Commentaire supprimé |||| %{smart_count} commentaires supprimés',
            },
        },
        users: {
            name: 'Utilisateur |||| Utilisateurs',
            fields: {
                name: 'Nom',
                role: 'Rôle',
            },
            notifications: {
                created:
                    'Utilisateur créé |||| %{smart_count} utilisateurs créés',
                updated:
                    'Utilisateur mis à jour |||| %{smart_count} utilisateurs mis à jour',
                deleted:
                    'Utilisateur supprimé |||| %{smart_count} utilisateurs supprimés',
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
    },
};
