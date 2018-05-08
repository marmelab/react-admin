import { defineMessages } from 'react-intl'
import frenchMessages from '@yeutech/ra-language-intl/translation/fr.json';

const posMessages = defineMessages({
  search: {
    id: 'pos.search',
    defaultMessage: 'Rechercher'
  },
  configuration: {
    id: 'pos.configuration',
    defaultMessage: 'Configuration'
  },
  language: {
    id: 'pos.language',
    defaultMessage: 'Langue'
  },
  themeName: {
    id: 'pos.theme.name',
    defaultMessage: 'Theme'
  },
  themeLight: {
    id: 'pos.theme.light',
    defaultMessage: 'Clair'
  },
  themeDark: {
    id: 'pos.theme.dark',
    defaultMessage: 'Obscur'
  },
  dashboardMonthlyRevenue: {
    id: 'pos.dashboard.monthly_revenue',
    defaultMessage: 'CA à 30 jours'
  },
  dashboardNewOrders: {
    id: 'pos.dashboard.new_orders',
    defaultMessage: 'Nouvelles commandes'
  },
  dashboardPendingReviews: {
    id: 'pos.dashboard.pending_reviews',
    defaultMessage: 'Commentaires à modérer'
  },
  dashboardNewCustomers: {
    id: 'pos.dashboard.new_customers',
    defaultMessage: 'Nouveaux clients'
  },
  dashboardPendingOrders: {
    id: 'pos.dashboard.pending_orders',
    defaultMessage: 'Commandes à traiter'
  },
  dashboardOrderItems: {
    id: 'pos.dashboard.order.items',
    defaultMessage: 'par {customer_name}, {nb_items, plural, one {un poster} other {{nb_items} posters}}'
  },
  dashboardWelcomeTitle: {
    id: 'pos.dashboard.welcome.title',
    defaultMessage: 'Bienvenue sur la démo de react-admin'
  },
  dashboardWelcomeSubtitle: {
    id: 'pos.dashboard.welcome.subtitle',
    defaultMessage: 'Ceci est le back-office d\'un magasin de posters imaginaire. N\'hésitez pas à explorer et à modifier les données. La démo s\'exécute en local dans votre navigateur, et se remet à zéro chaque fois que vous rechargez la page.'
  },
  dashboardWelcomeAorButton: {
    id: 'pos.dashboard.welcome.aor_button',
    defaultMessage: 'Site web de react-admin'
  },
  dashboardWelcomeDemoButton: {
    id: 'pos.dashboard.welcome.demo_button',
    defaultMessage: 'Code source de cette démo'
  }
});

const resourcesMessages = defineMessages({
  customersName: {
    id: 'resources.customers.name',
    defaultMessage: '{smart_count, plural, one {Client} other {Clients}}'
  },
  customersFieldsAddress: {
    id: 'resources.customers.fields.address',
    defaultMessage: 'Rue'
  },
  customersFieldsBirthday: {
    id: 'resources.customers.fields.birthday',
    defaultMessage: 'Anniversaire'
  },
  customersFieldsCity: {
    id: 'resources.customers.fields.city',
    defaultMessage: 'Ville'
  },
  customersFieldsCommands: {
    id: 'resources.customers.fields.commands',
    defaultMessage: 'Commandes'
  },
  customersFieldsFirstName: {
    id: 'resources.customers.fields.first_name',
    defaultMessage: 'Prénom'
  },
  customersFieldsFirstSeen: {
    id: 'resources.customers.fields.first_seen',
    defaultMessage: 'Première visite'
  },
  customersFieldsGroups: {
    id: 'resources.customers.fields.groups',
    defaultMessage: 'Segments'
  },
  customersFieldsHasNewsletter: {
    id: 'resources.customers.fields.has_newsletter',
    defaultMessage: 'Abonné à la newsletter'
  },
  customersFieldsHasOrdered: {
    id: 'resources.customers.fields.has_ordered',
    defaultMessage: 'A commandé'
  },
  customersFieldsLastName: {
    id: 'resources.customers.fields.last_name',
    defaultMessage: 'Nom'
  },
  customersFieldsLastSeen: {
    id: 'resources.customers.fields.last_seen',
    defaultMessage: 'Vu le'
  },
  customersFieldsLastSeenGte: {
    id: 'resources.customers.fields.last_seen_gte',
    defaultMessage: 'Vu depuis'
  },
  customersFieldsLatestPurchase: {
    id: 'resources.customers.fields.latest_purchase',
    defaultMessage: 'Dernier achat'
  },
  customersFieldsName: {
    id: 'resources.customers.fields.name',
    defaultMessage: 'Nom'
  },
  customersFieldsTotalSpent: {
    id: 'resources.customers.fields.total_spent',
    defaultMessage: 'Dépenses'
  },
  customersFieldsZipcode: {
    id: 'resources.customers.fields.zipcode',
    defaultMessage: 'Code postal'
  },
  customersTabsIdentity: {
    id: 'resources.customers.tabs.identity',
    defaultMessage: 'Identité'
  },
  customersTabsAddress: {
    id: 'resources.customers.tabs.address',
    defaultMessage: 'Adresse'
  },
  customersTabsOrders: {
    id: 'resources.customers.tabs.orders',
    defaultMessage: 'Commandes'
  },
  customersTabsReviews: {
    id: 'resources.customers.tabs.reviews',
    defaultMessage: 'Commentaires'
  },
  customersTabsStats: {
    id: 'resources.customers.tabs.stats',
    defaultMessage: 'Statistiques'
  },
  customersPageDelete: {
    id: 'resources.customers.page.delete',
    defaultMessage: 'Supprimer le client'
  },
  commandsName: {
    id: 'resources.commands.name',
    defaultMessage: '{smart_count, plural, one {Commande} other {Commandes}}'
  },
  commandsFieldsBasketDelivery: {
    id: 'resources.commands.fields.basket.delivery',
    defaultMessage: 'Frais de livraison'
  },
  commandsFieldsBasketReference: {
    id: 'resources.commands.fields.basket.reference',
    defaultMessage: 'Référence'
  },
  commandsFieldsBasketQuantity: {
    id: 'resources.commands.fields.basket.quantity',
    defaultMessage: 'Quantité'
  },
  commandsFieldsBasketSum: {
    id: 'resources.commands.fields.basket.sum',
    defaultMessage: 'Sous-total'
  },
  commandsFieldsBasketTaxRate: {
    id: 'resources.commands.fields.basket.tax_rate',
    defaultMessage: 'TVA'
  },
  commandsFieldsBasketTotal: {
    id: 'resources.commands.fields.basket.total',
    defaultMessage: 'Total'
  },
  commandsFieldsBasketUnitPrice: {
    id: 'resources.commands.fields.basket.unit_price',
    defaultMessage: 'P.U.'
  },
  commandsFieldsCustomerId: {
    id: 'resources.commands.fields.customer_id',
    defaultMessage: 'Client'
  },
  commandsFieldsDateGte: {
    id: 'resources.commands.fields.date_gte',
    defaultMessage: 'Passées depuis'
  },
  commandsFieldsDateLte: {
    id: 'resources.commands.fields.date_lte',
    defaultMessage: 'Passées avant'
  },
  commandsFieldsNbItems: {
    id: 'resources.commands.fields.nb_items',
    defaultMessage: 'Nb articles'
  },
  commandsFieldsReference: {
    id: 'resources.commands.fields.reference',
    defaultMessage: 'Référence'
  },
  commandsFieldsReturned: {
    id: 'resources.commands.fields.returned',
    defaultMessage: 'Annulée'
  },
  commandsFieldsStatus: {
    id: 'resources.commands.fields.status',
    defaultMessage: 'Etat'
  },
  commandsFieldsTotalGte: {
    id: 'resources.commands.fields.total_gte',
    defaultMessage: 'Montant minimum'
  },
  productsName: {
    id: 'resources.products.name',
    defaultMessage: '{smart_count, plural, one {Poster} other {Posters}}'
  },
  productsFieldsCategoryId: {
    id: 'resources.products.fields.category_id',
    defaultMessage: 'Catégorie'
  },
  productsFieldsHeightGte: {
    id: 'resources.products.fields.height_gte',
    defaultMessage: 'Hauteur mini'
  },
  productsFieldsHeightLte: {
    id: 'resources.products.fields.height_lte',
    defaultMessage: 'Hauteur maxi'
  },
  productsFieldsHeight: {
    id: 'resources.products.fields.height',
    defaultMessage: 'Hauteur'
  },
  productsFieldsImage: {
    id: 'resources.products.fields.image',
    defaultMessage: 'Photo'
  },
  productsFieldsPrice: {
    id: 'resources.products.fields.price',
    defaultMessage: 'Prix'
  },
  productsFieldsReference: {
    id: 'resources.products.fields.reference',
    defaultMessage: 'Référence'
  },
  productsFieldsStockLte: {
    id: 'resources.products.fields.stock_lte',
    defaultMessage: 'Stock faible'
  },
  productsFieldsStock: {
    id: 'resources.products.fields.stock',
    defaultMessage: 'Stock'
  },
  productsFieldsThumbnail: {
    id: 'resources.products.fields.thumbnail',
    defaultMessage: 'Aperçu'
  },
  productsFieldsWidthGte: {
    id: 'resources.products.fields.width_gte',
    defaultMessage: 'Largeur mini'
  },
  productsFieldsWidthLte: {
    id: 'resources.products.fields.width_lte',
    defaultMessage: 'Margeur maxi'
  },
  productsFieldsWidth: {
    id: 'resources.products.fields.width',
    defaultMessage: 'Largeur'
  },
  productsTabsImage: {
    id: 'resources.products.tabs.image',
    defaultMessage: 'Image'
  },
  productsTabsDetails: {
    id: 'resources.products.tabs.details',
    defaultMessage: 'Détails'
  },
  productsTabsDescription: {
    id: 'resources.products.tabs.description',
    defaultMessage: 'Description'
  },
  productsTabsReviews: {
    id: 'resources.products.tabs.reviews',
    defaultMessage: 'Commentaires'
  },
  categoriesName: {
    id: 'resources.categories.name',
    defaultMessage: '{smart_count, plural, one {Catégorie} other {Catégories}}'
  },
  categoriesFieldsName: {
    id: 'resources.categories.fields.name',
    defaultMessage: 'Nom'
  },
  categoriesFieldsProducts: {
    id: 'resources.categories.fields.products',
    defaultMessage: 'Produits'
  },
  reviewsName: {
    id: 'resources.reviews.name',
    defaultMessage: '{smart_count, plural, one {Commentaire} other {Commentaires}}'
  },
  reviewsFieldsCustomerId: {
    id: 'resources.reviews.fields.customer_id',
    defaultMessage: 'Client'
  },
  reviewsFieldsCommandId: {
    id: 'resources.reviews.fields.command_id',
    defaultMessage: 'Commande'
  },
  reviewsFieldsProductId: {
    id: 'resources.reviews.fields.product_id',
    defaultMessage: 'Produit'
  },
  reviewsFieldsDateGte: {
    id: 'resources.reviews.fields.date_gte',
    defaultMessage: 'Publié depuis'
  },
  reviewsFieldsDateLte: {
    id: 'resources.reviews.fields.date_lte',
    defaultMessage: 'Publié avant'
  },
  reviewsFieldsDate: {
    id: 'resources.reviews.fields.date',
    defaultMessage: 'Date'
  },
  reviewsFieldsComment: {
    id: 'resources.reviews.fields.comment',
    defaultMessage: 'Texte'
  },
  reviewsFieldsStatus: {
    id: 'resources.reviews.fields.status',
    defaultMessage: 'Statut'
  },
  reviewsFieldsRating: {
    id: 'resources.reviews.fields.rating',
    defaultMessage: 'Classement'
  },
  reviewsActionAccept: {
    id: 'resources.reviews.action.accept',
    defaultMessage: 'Accepter'
  },
  reviewsActionReject: {
    id: 'resources.reviews.action.reject',
    defaultMessage: 'Rejeter'
  },
  reviewsNotificationApprovedSuccess: {
    id: 'resources.reviews.notification.approved_success',
    defaultMessage: 'Commentaire approuvé'
  },
  reviewsNotificationApprovedError: {
    id: 'resources.reviews.notification.approved_error',
    defaultMessage: 'Erreur: Commentaire non approuvé'
  },
  reviewsNotificationRejectedSuccess: {
    id: 'resources.reviews.notification.rejected_success',
    defaultMessage: 'Commentaire rejeté'
  },
  reviewsNotificationRejectedError: {
    id: 'resources.reviews.notification.rejected_error',
    defaultMessage: 'Erreur: Commentaire non rejeté'
  },
  segmentsName: {
    id: 'resources.segments.name',
    defaultMessage: 'Segments'
  },
  segmentsFieldsCustomers: {
    id: 'resources.segments.fields.customers',
    defaultMessage: 'Clients'
  },
  segmentsFieldsName: {
    id: 'resources.segments.fields.name',
    defaultMessage: 'Nom'
  },
  segmentsDataCompulsive: {
    id: 'resources.segments.data.compulsive',
    defaultMessage: 'Compulsif'
  },
  segmentsDataCollector: {
    id: 'resources.segments.data.collector',
    defaultMessage: 'Collectionneur'
  },
  segmentsDataOrderedOnce: {
    id: 'resources.segments.data.ordered_once',
    defaultMessage: 'A commandé'
  },
  segmentsDataRegular: {
    id: 'resources.segments.data.regular',
    defaultMessage: 'Régulier'
  },
  segmentsDataReturns: {
    id: 'resources.segments.data.returns',
    defaultMessage: 'A renvoyé'
  },
  segmentsDataReviewer: {
    id: 'resources.segments.data.reviewer',
    defaultMessage: 'Commentateur'
  }
});

// we just convert quickly the file so we don't need to use babel-plugin-react-intl
const obj = {};
[posMessages, resourcesMessages].forEach((msgs) => {
  Object.values(msgs).forEach((value) => {
    obj[value.id] = value.defaultMessage;
  });
});

export default {
  ...frenchMessages,
  ...obj,
};
