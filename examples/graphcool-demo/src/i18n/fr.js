import frenchMessages from 'ra-language-french';

export default {
    ...frenchMessages,
    pos: {
        search: 'Rechercher',
        configuration: 'Configuration',
        language: 'Langue',
        theme: {
            name: 'Theme',
            light: 'Clair',
            dark: 'Obscur',
        },
        dashboard: {
            monthly_revenue: 'CA à 30 jours',
            new_orders: 'Nouvelles commandes',
            pending_reviews: 'Commentaires à modérer',
            new_customers: 'Nouveaux clients',
            pending_orders: 'Commandes à traiter',
            order: {
                items:
                    'par %{customer_name}, un poster |||| par %{customer_name}, %{nb_items} posters',
            },
            welcome: {
                title: 'Bienvenue sur la démo de react-admin',
                subtitle:
                    "Ceci est le back-office d'un magasin de posters imaginaire. N'hésitez pas à explorer et à modifier les données. La démo s'exécute en local dans votre navigateur, et se remet à zéro chaque fois que vous rechargez la page.",
                aor_button: 'Site web de react-admin',
                demo_button: 'Code source de cette démo',
            },
        },
    },
    resources: {
        Customer: {
            name: 'Client |||| Clients',
            fields: {
                address: 'Rue',
                birthday: 'Anniversaire',
                city: 'Ville',
                commands: 'Commandes',
                firstName: 'Prénom',
                firstSeen: 'Première visite',
                groups: 'Segments',
                hasNewsletter: 'Abonné à la newsletter',
                hasOrdered: 'A commandé',
                lastName: 'Nom',
                lastSeen: 'Vu le',
                lastSeen_gte: 'Vu depuis',
                latestPurchase: 'Dernier achat',
                name: 'Nom',
                totalSpent: 'Dépenses',
                zipcode: 'Code postal',
            },
            tabs: {
                identity: 'Identité',
                address: 'Adresse',
                orders: 'Commandes',
                reviews: 'Commentaires',
                stats: 'Statistiques',
            },
            page: {
                delete: 'Supprimer le client',
            },
        },
        Command: {
            name: 'Commande |||| Commandes',
            fields: {
                basket: {
                    delivery: 'Frais de livraison',
                    reference: 'Référence',
                    quantity: 'Quantité',
                    sum: 'Sous-total',
                    tax_rate: 'TVA',
                    total: 'Total',
                    unit_price: 'P.U.',
                },
                'customer.id': 'Client',
                date_gte: 'Passées depuis',
                date_lte: 'Passées avant',
                nb_items: 'Nb articles',
                reference: 'Référence',
                returned: 'Annulée',
                status: 'Etat',
                total_gte: 'Montant minimum',
            },
        },
        Product: {
            name: 'Poster |||| Posters',
            fields: {
                'category.id': 'Catégorie',
                height_gte: 'Hauteur mini',
                height_lte: 'Hauteur maxi',
                height: 'Hauteur',
                image: 'Photo',
                price: 'Prix',
                reference: 'Référence',
                stock_lte: 'Stock faible',
                stock: 'Stock',
                thumbnail: 'Aperçu',
                width_gte: 'Largeur mini',
                width_lte: 'Margeur maxi',
                width: 'Largeur',
            },
            tabs: {
                image: 'Image',
                details: 'Détails',
                description: 'Description',
                reviews: 'Commentaires',
            },
        },
        Category: {
            name: 'Catégorie |||| Catégories',
            fields: {
                name: 'Nom',
                products: 'Produits',
            },
        },
        Review: {
            name: 'Commentaire |||| Commentaires',
            fields: {
                'customer.id': 'Client',
                'command.id': 'Commande',
                'product.id': 'Produit',
                date_gte: 'Publié depuis',
                date_lte: 'Publié avant',
                date: 'Date',
                comment: 'Texte',
                status: 'Statut',
                rating: 'Classement',
            },
            action: {
                accept: 'Accepter',
                reject: 'Rejeter',
            },
            notification: {
                approved_success: 'Commentaire approuvé',
                approved_error: 'Erreur: Commentaire non approuvé',
                rejected_success: 'Commentaire rejeté',
                rejected_error: 'Erreur: Commentaire non rejeté',
            },
        },
        Segment: {
            name: 'Segments',
            fields: {
                customers: 'Clients',
                name: 'Nom',
            },
            data: {
                compulsive: 'Compulsif',
                collector: 'Collectionneur',
                ordered_once: 'A commandé',
                regular: 'Régulier',
                returns: 'A renvoyé',
                reviewer: 'Commentateur',
            },
        },
    },
};
