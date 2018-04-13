import { defineMessages } from 'react-intl'
import englishMessages from '@yeutech/ra-language-intl/translation/en.json';

const posMessages = defineMessages({
  search: {
    id: 'pos.search',
    defaultMessage: 'Search',
  },
  configuration: {
    id: 'pos.configuration',
    defaultMessage: 'Configuration',
  },
  language: {
    id: 'pos.language',
    defaultMessage: 'Language',
  },
  themeName: {
    id: 'pos.theme.name',
    defaultMessage: 'Theme',
  },
  themeLight: {
    id: 'pos.theme.light',
    defaultMessage: 'Light',
  },
  themeDark: {
    id: 'pos.theme.dark',
    defaultMessage: 'Dark',
  },
  dashboardMonthlyRevenue: {
    id: 'pos.dashboard.monthly_revenue',
    defaultMessage: 'Monthly Revenue',
  },
  dashboardNewOrders: {
    id: 'pos.dashboard.new_orders',
    defaultMessage: 'New Orders',
  },
  dashboardPendingReviews: {
    id: 'pos.dashboard.pending_reviews',
    defaultMessage: 'Pending Reviews',
  },
  dashboardNewCustomers: {
    id: 'pos.dashboard.new_customers',
    defaultMessage: 'New Customers',
  },
  dashboardPendingOrders: {
    id: 'pos.dashboard.pending_orders',
    defaultMessage: 'Pending Orders',
  },
  dashboardOrderItems: {
    id: 'pos.dashboard.order.items',
    defaultMessage: 'by {customer_name}, {nb_items, plural, one {one item} other {{nb_items, number} items}}',
  },
  dashboardWelcomeTitle: {
    id: 'pos.dashboard.welcome.title',
    defaultMessage: 'Welcome to react-admin demo',
  },
  dashboardWelcomeSubtitle: {
    id: 'pos.dashboard.welcome.subtitle',
    defaultMessage: 'This is the admin of an imaginary poster shop. Fell free to explore and modify the data - it\'s local to your computer, and will reset each time you reload.',
  },
  dashboardWelcomeAorButton: {
    id: 'pos.dashboard.welcome.aor_button',
    defaultMessage: 'react-admin site',
  },
  dashboardWelcomeDemoButton: {
    id: 'pos.dashboard.welcome.demo_button',
    defaultMessage: 'Source for this demo',
  },
});

const resourcesMessages = defineMessages({
  customersName: {
    id: 'resources.customers.name',
    defaultMessage: '{smart_count, plural, one {Customer} other {Customers}}',
  },
  customersFieldsCommands: {
    id: 'resources.customers.fields.commands',
    defaultMessage: 'Orders',
  },
  customersFieldsGroups: {
    id: 'resources.customers.fields.groups',
    defaultMessage: 'Segments',
  },
  customersFieldsLastSeenGte: {
    id: 'resources.customers.fields.last_seen_gte',
    defaultMessage: 'Visited Since',
  },
  customersFieldsName: {
    id: 'resources.customers.fields.name',
    defaultMessage: 'Name',
  },
  customersFieldsTotalSpent: {
    id: 'resources.customers.fields.total_spent',
    defaultMessage: 'Total spent',
  },
  customersTabsIdentity: {
    id: 'resources.customers.tabs.identity',
    defaultMessage: 'Identity',
  },
  customersTabsAddress: {
    id: 'resources.customers.tabs.address',
    defaultMessage: 'Address',
  },
  customersTabsOrders: {
    id: 'resources.customers.tabs.orders',
    defaultMessage: 'Orders',
  },
  customersTabsReviews: {
    id: 'resources.customers.tabs.reviews',
    defaultMessage: 'Reviews',
  },
  customersTabsStats: {
    id: 'resources.customers.tabs.stats',
    defaultMessage: 'Stats',
  },
  customersPageDelete: {
    id: 'resources.customers.page.delete',
    defaultMessage: 'Delete Customer',
  },
  commandsName: {
    id: 'resources.commands.name',
    defaultMessage: '{smart_count, plural, one {Order} other {Orders}}',
  },
  commandsFieldsBasketDelivery: {
    id: 'resources.commands.fields.basket.delivery',
    defaultMessage: 'Delivery',
  },
  commandsFieldsBasketReference: {
    id: 'resources.commands.fields.basket.reference',
    defaultMessage: 'Reference',
  },
  commandsFieldsBasketQuantity: {
    id: 'resources.commands.fields.basket.quantity',
    defaultMessage: 'Quantity',
  },
  commandsFieldsBasketSum: {
    id: 'resources.commands.fields.basket.sum',
    defaultMessage: 'Sum',
  },
  commandsFieldsBasketTaxRate: {
    id: 'resources.commands.fields.basket.tax_rate',
    defaultMessage: 'Tax Rate',
  },
  commandsFieldsBasketTotal: {
    id: 'resources.commands.fields.basket.total',
    defaultMessage: 'Total',
  },
  commandsFieldsBasketUnitPrice: {
    id: 'resources.commands.fields.basket.unit_price',
    defaultMessage: 'Unit Price',
  },
  commandsFieldsCustomerId: {
    id: 'resources.commands.fields.customer_id',
    defaultMessage: 'Customer',
  },
  commandsFieldsDateGte: {
    id: 'resources.commands.fields.date_gte',
    defaultMessage: 'Passed Since',
  },
  commandsFieldsDateLte: {
    id: 'resources.commands.fields.date_lte',
    defaultMessage: 'Passed Before',
  },
  commandsFieldsTotalGte: {
    id: 'resources.commands.fields.total_gte',
    defaultMessage: 'Min amount',
  },
  commandsFieldsStatus: {
    id: 'resources.commands.fields.status',
    defaultMessage: 'Status',
  },
  commandsFieldsReturned: {
    id: 'resources.commands.fields.returned',
    defaultMessage: 'Returned',
  },
  productsName: {
    id: 'resources.products.name',
    defaultMessage: '{smart_count, plural, one {Poster} other {Posters}}',
  },
  productsFieldsCategoryId: {
    id: 'resources.products.fields.category_id',
    defaultMessage: 'Category',
  },
  productsFieldsHeightGte: {
    id: 'resources.products.fields.height_gte',
    defaultMessage: 'Min height',
  },
  productsFieldsHeightLte: {
    id: 'resources.products.fields.height_lte',
    defaultMessage: 'Max height',
  },
  productsFieldsHeight: {
    id: 'resources.products.fields.height',
    defaultMessage: 'Height',
  },
  productsFieldsImage: {
    id: 'resources.products.fields.image',
    defaultMessage: 'Image',
  },
  productsFieldsPrice: {
    id: 'resources.products.fields.price',
    defaultMessage: 'Price',
  },
  productsFieldsReference: {
    id: 'resources.products.fields.reference',
    defaultMessage: 'Reference',
  },
  productsFieldsStockLte: {
    id: 'resources.products.fields.stock_lte',
    defaultMessage: 'Low Stock',
  },
  productsFieldsStock: {
    id: 'resources.products.fields.stock',
    defaultMessage: 'Stock',
  },
  productsFieldsThumbnail: {
    id: 'resources.products.fields.thumbnail',
    defaultMessage: 'Thumbnail',
  },
  productsFieldsWidthGte: {
    id: 'resources.products.fields.width_gte',
    defaultMessage: 'Min width',
  },
  productsFieldsWidthLte: {
    id: 'resources.products.fields.width_lte',
    defaultMessage: 'mx_width',
  },
  productsFieldsWidth: {
    id: 'resources.products.fields.width',
    defaultMessage: 'Width',
  },
  productsTabsImage: {
    id: 'resources.products.tabs.image',
    defaultMessage: 'Image',
  },
  productsTabsDetails: {
    id: 'resources.products.tabs.details',
    defaultMessage: 'Details',
  },
  productsTabsDescription: {
    id: 'resources.products.tabs.description',
    defaultMessage: 'Description',
  },
  productsTabsReviews: {
    id: 'resources.products.tabs.reviews',
    defaultMessage: 'Reviews',
  },
  categoriesName: {
    id: 'resources.categories.name',
    defaultMessage: '{smart_count, plural, one {Category} other {Categories}}',
  },
  categoriesFieldsProducts: {
    id: 'resources.categories.fields.products',
    defaultMessage: 'Products',
  },
  reviewsName: {
    id: 'resources.reviews.name',
    defaultMessage: '{smart_count, plural, one {Review} other {Reviews}}',
  },
  reviewsFieldsCustomerId: {
    id: 'resources.reviews.fields.customer_id',
    defaultMessage: 'Customer',
  },
  reviewsFieldsCommandId: {
    id: 'resources.reviews.fields.command_id',
    defaultMessage: 'Order',
  },
  reviewsFieldsProductId: {
    id: 'resources.reviews.fields.product_id',
    defaultMessage: 'Product',
  },
  reviewsFieldsDateGte: {
    id: 'resources.reviews.fields.date_gte',
    defaultMessage: 'Posted since',
  },
  reviewsFieldsDateLte: {
    id: 'resources.reviews.fields.date_lte',
    defaultMessage: 'Posted before',
  },
  reviewsFieldsDate: {
    id: 'resources.reviews.fields.date',
    defaultMessage: 'Date',
  },
  reviewsFieldsComment: {
    id: 'resources.reviews.fields.comment',
    defaultMessage: 'Comment',
  },
  reviewsFieldsRating: {
    id: 'resources.reviews.fields.rating',
    defaultMessage: 'Rating',
  },
  reviewsActionAccept: {
    id: 'resources.reviews.action.accept',
    defaultMessage: 'Accept',
  },
  reviewsActionReject: {
    id: 'resources.reviews.action.reject',
    defaultMessage: 'Reject',
  },
  reviewsNotificationApprovedSuccess: {
    id: 'resources.reviews.notification.approved_success',
    defaultMessage: 'Review approved',
  },
  reviewsNotificationApprovedError: {
    id: 'resources.reviews.notification.approved_error',
    defaultMessage: 'Error: Review not approved',
  },
  reviewsNotificationRejectedSuccess: {
    id: 'resources.reviews.notification.rejected_success',
    defaultMessage: 'Review rejected',
  },
  reviewsNotificationRejectedError: {
    id: 'resources.reviews.notification.rejected_error',
    defaultMessage: 'Error: Review not rejected',
  },
  segmentsName: {
    id: 'resources.segments.name',
    defaultMessage: 'Segments',
  },
  segmentsFieldsCustomers: {
    id: 'resources.segments.fields.customers',
    defaultMessage: 'Customers',
  },
  segmentsFieldsName: {
    id: 'resources.segments.fields.name',
    defaultMessage: 'Name',
  },
  segmentsDataCompulsive: {
    id: 'resources.segments.data.compulsive',
    defaultMessage: 'Compulsive',
  },
  segmentsDataCollector: {
    id: 'resources.segments.data.collector',
    defaultMessage: 'Collector',
  },
  segmentsDataOrderedOnce: {
    id: 'resources.segments.data.ordered_once',
    defaultMessage: 'Ordered once',
  },
  segmentsDataRegular: {
    id: 'resources.segments.data.regular',
    defaultMessage: 'Regular',
  },
  segmentsDataReturns: {
    id: 'resources.segments.data.returns',
    defaultMessage: 'Returns',
  },
  segmentsDataReviewer: {
    id: 'resources.segments.data.reviewer',
    defaultMessage: 'Reviewer',
  },
});

// we just convert quickly the file so we don't need to use babel-plugin-react-intl
const obj = {};
[posMessages, resourcesMessages].forEach((msgs) => {
  Object.values(msgs).forEach((value) => {
    obj[value.id] = value.defaultMessage;
  });
});

export default {
  ...englishMessages,
  ...obj,
};
