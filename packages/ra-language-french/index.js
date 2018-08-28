module.exports = {
    ra: {
        action: {
            add_filter: 'Ajouter un filtre',
            add: 'Ajouter',
            back: 'Retour',
            bulk_actions:
                '%{smart_count} selectionné |||| %{smart_count} selectionnés',
            cancel: 'Annuler',
            clear_input_value: 'Vider le champ',
            clone: 'Dupliquer',
            create: 'Créer',
            delete: 'Supprimer',
            edit: 'Éditer',
            export: 'Exporter',
            list: 'Liste',
            refresh: 'Actualiser',
            remove_filter: 'Supprimer ce filtre',
            remove: 'Supprimer',
            save: 'Enregistrer',
            search: 'Rechercher',
            show: 'Afficher',
            sort: 'Trier',
            undo: 'Annuler',
        },
        boolean: {
            true: 'Oui',
            false: 'Non',
        },
        page: {
            create: 'Créer %{name}',
            dashboard: 'Tableau de bord',
            edit: '%{name} #%{id}',
            error: 'Un problème est survenu',
            list: 'Liste des %{name}',
            loading: 'Chargement',
            not_found: 'Page manquante',
            show: '%{name} #%{id}',
        },
        input: {
            file: {
                upload_several:
                    'Déposez les fichiers à uploader, ou cliquez pour en sélectionner.',
                upload_single:
                    'Déposez le fichier à uploader, ou cliquez pour le sélectionner.',
            },
            image: {
                upload_several:
                    'Déposez les images à uploader, ou cliquez pour en sélectionner.',
                upload_single:
                    "Déposez l'image à uploader, ou cliquez pour la sélectionner.",
            },
            references: {
                all_missing: 'Impossible de trouver des données de références.',
                many_missing:
                    'Au moins une des références associées semble ne plus être disponible.',
                single_missing:
                    'La référence associée ne semble plus disponible.',
            },
        },
        message: {
            about: 'Au sujet de',
            are_you_sure: 'Êtes-vous sûr ?',
            bulk_delete_content:
                'Êtes-vous sur(e) de vouloir supprimer cet élément ? |||| Êtes-vous sur(e) de vouloir supprimer ces %{smart_count} éléments ?',
            bulk_delete_title:
                'Supprimer %{name} |||| Supprimer %{smart_count} %{name} éléments',
            delete_content:
                'Êtes-vous sur(e) de vouloir supprimer cet élément ?',
            delete_title: 'Supprimer %{name} #%{id}',
            details: 'Détails',
            error:
                "En raison d'une erreur côté navigateur, votre requête n'a pas pu aboutir.",
            invalid_form: "Le formulaire n'est pas valide.",
            loading:
                'La page est en cours de chargement, merci de bien vouloir patienter.',
            no: 'Non',
            not_found:
                "L'URL saisie est incorrecte, ou vous avez suivi un mauvais lien.",
            yes: 'Oui',
        },
        navigation: {
            no_results: 'Aucun résultat',
            page_out_of_boundaries: 'La page %{page} est en dehors des limites',
            page_out_from_end: 'Fin de la pagination',
            page_out_from_begin: 'La page doit être supérieure à 1',
            page_range_info: '%{offsetBegin}-%{offsetEnd} sur %{total}',
            page_rows_per_page: 'Lignes par page :',
            next: 'Suivant',
            prev: 'Précédent',
        },
        auth: {
            user_menu: 'Profile',
            username: 'Identifiant',
            password: 'Mot de passe',
            sign_in: 'Connexion',
            sign_in_error: "Échec de l'authentification, merci de réessayer",
            logout: 'Déconnexion',
        },
        notification: {
            updated:
                'Élément mis à jour |||| %{smart_count} élements mis à jour',
            created: 'Élément créé',
            deleted: 'Élément supprimé |||| %{smart_count} élements supprimés',
            bad_item: 'Élément inconnu',
            item_doesnt_exist: "L'élément n'existe pas",
            http_error: 'Erreur de communication avec le serveur',
            data_provider_error:
                'Erreur dans le dataProvider. Plus de détails dans la console.',
            canceled: 'Action annulée',
        },
        validation: {
            required: 'Ce champ est requis',
            minLength: 'Minimum %{min} caractères',
            maxLength: 'Maximum %{max} caractères',
            minValue: 'Minimum %{min}',
            maxValue: 'Maximum %{max}',
            number: 'Doit être un nombre',
            email: 'Doit être un email',
        },
    },
};
