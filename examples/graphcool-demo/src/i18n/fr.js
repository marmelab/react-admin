import { defineMessages } from 'react-intl'
import frenchMessages from 'ra-language-intl/translation/fr.json';

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
    defaultMessage: 'par {customer_name}, {nb_items, plural, one {un poster} other {{nb_items, number} posters}}'
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
  CustomerName: {
    id: 'resources.Customer.name',
    defaultMessage: '{smart_count, plural, one {Client} other {Clients}}'
  },
  CustomerFieldsAddress: {
    id: 'resources.Customer.fields.address',
    defaultMessage: 'Rue'
  },
  CustomerFieldsBirthday: {
    id: 'resources.Customer.fields.birthday',
    defaultMessage: 'Anniversaire'
  },
  CustomerFieldsCity: {
    id: 'resources.Customer.fields.city',
    defaultMessage: 'Ville'
  },
  CustomerFieldsCommands: {
    id: 'resources.Customer.fields.commands',
    defaultMessage: 'Commandes'
  },
  CustomerFieldsFirstName: {
    id: 'resources.Customer.fields.firstName',
    defaultMessage: 'Prénom'
  },
  CustomerFieldsFirstSeen: {
    id: 'resources.Customer.fields.firstSeen',
    defaultMessage: 'Première visite'
  },
  CustomerFieldsGroups: {
    id: 'resources.Customer.fields.groups',
    defaultMessage: 'Segments'
  },
  CustomerFieldsHasNewsletter: {
    id: 'resources.Customer.fields.hasNewsletter',
    defaultMessage: 'Abonné à la newsletter'
  },
  CustomerFieldsHasOrdered: {
    id: 'resources.Customer.fields.hasOrdered',
    defaultMessage: 'A commandé'
  },
  CustomerFieldsLastName: {
    id: 'resources.Customer.fields.lastName',
    defaultMessage: 'Nom'
  },
  CustomerFieldsLastSeen: {
    id: 'resources.Customer.fields.lastSeen',
    defaultMessage: 'Vu le'
  },
  CustomerFieldsLastSeenGte: {
    id: 'resources.Customer.fields.lastSeen_gte',
    defaultMessage: 'Vu depuis'
  },
  CustomerFieldsLatestPurchase: {
    id: 'resources.Customer.fields.latestPurchase',
    defaultMessage: 'Dernier achat'
  },
  CustomerFieldsName: {
    id: 'resources.Customer.fields.name',
    defaultMessage: 'Nom'
  },
  CustomerFieldsTotalSpent: {
    id: 'resources.Customer.fields.totalSpent',
    defaultMessage: 'Dépenses'
  },
  CustomerFieldsZipcode: {
    id: 'resources.Customer.fields.zipcode',
    defaultMessage: 'Code postal'
  },
  CustomerTabsIdentity: {
    id: 'resources.Customer.tabs.identity',
    defaultMessage: 'Identité'
  },
  CustomerTabsAddress: {
    id: 'resources.Customer.tabs.address',
    defaultMessage: 'Adresse'
  },
  CustomerTabsOrders: {
    id: 'resources.Customer.tabs.orders',
    defaultMessage: 'Commandes'
  },
  CustomerTabsReviews: {
    id: 'resources.Customer.tabs.reviews',
    defaultMessage: 'Commentaires'
  },
  CustomerTabsStats: {
    id: 'resources.Customer.tabs.stats',
    defaultMessage: 'Statistiques'
  },
  CustomerPageDelete: {
    id: 'resources.Customer.page.delete',
    defaultMessage: 'Supprimer le client'
  },
  CommandName: {
    id: 'resources.Command.name',
    defaultMessage: '{smart_count, plural, one {Commande} other {Commandes}}'
  },
  CommandFieldsBasketDelivery: {
    id: 'resources.Command.fields.basket.delivery',
    defaultMessage: 'Frais de livraison'
  },
  CommandFieldsBasketReference: {
    id: 'resources.Command.fields.basket.reference',
    defaultMessage: 'Référence'
  },
  CommandFieldsBasketQuantity: {
    id: 'resources.Command.fields.basket.quantity',
    defaultMessage: 'Quantité'
  },
  CommandFieldsBasketSum: {
    id: 'resources.Command.fields.basket.sum',
    defaultMessage: 'Sous-total'
  },
  CommandFieldsBasketTaxRate: {
    id: 'resources.Command.fields.basket.tax_rate',
    defaultMessage: 'TVA'
  },
  CommandFieldsBasketTotal: {
    id: 'resources.Command.fields.basket.total',
    defaultMessage: 'Total'
  },
  CommandFieldsBasketUnitPrice: {
    id: 'resources.Command.fields.basket.unit_price',
    defaultMessage: 'P.U.'
  },
  CommandFieldsCustomerId: {
    id: 'resources.Command.fields.customer.id',
    defaultMessage: 'Client'
  },
  CommandFieldsDateGte: {
    id: 'resources.Command.fields.date_gte',
    defaultMessage: 'Passées depuis'
  },
  CommandFieldsDateLte: {
    id: 'resources.Command.fields.date_lte',
    defaultMessage: 'Passées avant'
  },
  CommandFieldsNbItems: {
    id: 'resources.Command.fields.nb_items',
    defaultMessage: 'Nb articles'
  },
  CommandFieldsReference: {
    id: 'resources.Command.fields.reference',
    defaultMessage: 'Référence'
  },
  CommandFieldsReturned: {
    id: 'resources.Command.fields.returned',
    defaultMessage: 'Annulée'
  },
  CommandFieldsStatus: {
    id: 'resources.Command.fields.status',
    defaultMessage: 'Etat'
  },
  CommandFieldsTotalGte: {
    id: 'resources.Command.fields.total_gte',
    defaultMessage: 'Montant minimum'
  },
  ProductName: {
    id: 'resources.Product.name',
    defaultMessage: '{smart_count, plural, one {Poster} other {Posters}}'
  },
  ProductFieldsCategoryId: {
    id: 'resources.Product.fields.category.id',
    defaultMessage: 'Catégorie'
  },
  ProductFieldsHeightGte: {
    id: 'resources.Product.fields.height_gte',
    defaultMessage: 'Hauteur mini'
  },
  ProductFieldsHeightLte: {
    id: 'resources.Product.fields.height_lte',
    defaultMessage: 'Hauteur maxi'
  },
  ProductFieldsHeight: {
    id: 'resources.Product.fields.height',
    defaultMessage: 'Hauteur'
  },
  ProductFieldsImage: {
    id: 'resources.Product.fields.image',
    defaultMessage: 'Photo'
  },
  ProductFieldsPrice: {
    id: 'resources.Product.fields.price',
    defaultMessage: 'Prix'
  },
  ProductFieldsReference: {
    id: 'resources.Product.fields.reference',
    defaultMessage: 'Référence'
  },
  ProductFieldsStockLte: {
    id: 'resources.Product.fields.stock_lte',
    defaultMessage: 'Stock faible'
  },
  ProductFieldsStock: {
    id: 'resources.Product.fields.stock',
    defaultMessage: 'Stock'
  },
  ProductFieldsThumbnail: {
    id: 'resources.Product.fields.thumbnail',
    defaultMessage: 'Aperçu'
  },
  ProductFieldsWidthGte: {
    id: 'resources.Product.fields.width_gte',
    defaultMessage: 'Largeur mini'
  },
  ProductFieldsWidthLte: {
    id: 'resources.Product.fields.width_lte',
    defaultMessage: 'Margeur maxi'
  },
  ProductFieldsWidth: {
    id: 'resources.Product.fields.width',
    defaultMessage: 'Largeur'
  },
  ProductTabsImage: {
    id: 'resources.Product.tabs.image',
    defaultMessage: 'Image'
  },
  ProductTabsDetails: {
    id: 'resources.Product.tabs.details',
    defaultMessage: 'Détails'
  },
  ProductTabsDescription: {
    id: 'resources.Product.tabs.description',
    defaultMessage: 'Description'
  },
  ProductTabsReviews: {
    id: 'resources.Product.tabs.reviews',
    defaultMessage: 'Commentaires'
  },
  CategoryName: {
    id: 'resources.Category.name',
    defaultMessage: '{smart_count, plural, one {Catégorie} other {Catégories}}'
  },
  CategoryFieldsName: {
    id: 'resources.Category.fields.name',
    defaultMessage: 'Nom'
  },
  CategoryFieldsProducts: {
    id: 'resources.Category.fields.products',
    defaultMessage: 'Produits'
  },
  ReviewName: {
    id: 'resources.Review.name',
    defaultMessage: '{smart_count, plural, one {Commentaire} other {Commentaires}}'
  },
  ReviewFieldsCustomerId: {
    id: 'resources.Review.fields.customer.id',
    defaultMessage: 'Client'
  },
  ReviewFieldsCommandId: {
    id: 'resources.Review.fields.command.id',
    defaultMessage: 'Commande'
  },
  ReviewFieldsProductId: {
    id: 'resources.Review.fields.product.id',
    defaultMessage: 'Produit'
  },
  ReviewFieldsDateGte: {
    id: 'resources.Review.fields.date_gte',
    defaultMessage: 'Publié depuis'
  },
  ReviewFieldsDateLte: {
    id: 'resources.Review.fields.date_lte',
    defaultMessage: 'Publié avant'
  },
  ReviewFieldsDate: {
    id: 'resources.Review.fields.date',
    defaultMessage: 'Date'
  },
  ReviewFieldsComment: {
    id: 'resources.Review.fields.comment',
    defaultMessage: 'Texte'
  },
  ReviewFieldsStatus: {
    id: 'resources.Review.fields.status',
    defaultMessage: 'Statut'
  },
  ReviewFieldsRating: {
    id: 'resources.Review.fields.rating',
    defaultMessage: 'Classement'
  },
  ReviewActionAccept: {
    id: 'resources.Review.action.accept',
    defaultMessage: 'Accepter'
  },
  ReviewActionReject: {
    id: 'resources.Review.action.reject',
    defaultMessage: 'Rejeter'
  },
  ReviewNotificationApprovedSuccess: {
    id: 'resources.Review.notification.approved_success',
    defaultMessage: 'Commentaire approuvé'
  },
  ReviewNotificationApprovedError: {
    id: 'resources.Review.notification.approved_error',
    defaultMessage: 'Erreur: Commentaire non approuvé'
  },
  ReviewNotificationRejectedSuccess: {
    id: 'resources.Review.notification.rejected_success',
    defaultMessage: 'Commentaire rejeté'
  },
  ReviewNotificationRejectedError: {
    id: 'resources.Review.notification.rejected_error',
    defaultMessage: 'Erreur: Commentaire non rejeté'
  },
  SegmentName: {
    id: 'resources.Segment.name',
    defaultMessage: 'Segments'
  },
  SegmentFieldsCustomers: {
    id: 'resources.Segment.fields.customers',
    defaultMessage: 'Clients'
  },
  SegmentFieldsName: {
    id: 'resources.Segment.fields.name',
    defaultMessage: 'Nom'
  },
  SegmentDataCompulsive: {
    id: 'resources.Segment.data.compulsive',
    defaultMessage: 'Compulsif'
  },
  SegmentDataCollector: {
    id: 'resources.Segment.data.collector',
    defaultMessage: 'Collectionneur'
  },
  SegmentDataOrderedOnce: {
    id: 'resources.Segment.data.ordered_once',
    defaultMessage: 'A commandé'
  },
  SegmentDataRegular: {
    id: 'resources.Segment.data.regular',
    defaultMessage: 'Régulier'
  },
  SegmentDataReturns: {
    id: 'resources.Segment.data.returns',
    defaultMessage: 'A renvoyé'
  },
  SegmentDataReviewer: {
    id: 'resources.Segment.data.reviewer',
    defaultMessage: 'Commentateur'
  }
});

// we just convert quickly the file so we don't need to use babel-plugin-react-intl
const obj = {};
Object.values({ ...posMessages, ...resourcesMessages }).forEach((value) => {
  obj[value.id] = value.defaultMessage;
});

export default {
  ...frenchMessages,
  ...obj,
};
