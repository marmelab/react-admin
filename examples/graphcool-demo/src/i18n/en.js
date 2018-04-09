import { defineMessages } from 'react-intl'
import englishMessages from '@yeutech/ra-language-intl/translation/en.json';

const posMessages = defineMessages({
  search: {
    id: 'pos.search',
    defaultMessage: 'Search'
  },
  configuration: {
    id: 'pos.configuration',
    defaultMessage: 'Configuration'
  },
  language: {
    id: 'pos.language',
    defaultMessage: 'Language'
  },
  themeName: {
    id: 'pos.theme.name',
    defaultMessage: 'Theme'
  },
  themeLight: {
    id: 'pos.theme.light',
    defaultMessage: 'Light'
  },
  themeDark: {
    id: 'pos.theme.dark',
    defaultMessage: 'Dark'
  },
  dashboardMonthlyRevenue: {
    id: 'pos.dashboard.monthly_revenue',
    defaultMessage: 'Monthly Revenue'
  },
  dashboardNewOrders: {
    id: 'pos.dashboard.new_orders',
    defaultMessage: 'New Orders'
  },
  dashboardPendingReviews: {
    id: 'pos.dashboard.pending_reviews',
    defaultMessage: 'Pending Reviews'
  },
  dashboardNewCustomers: {
    id: 'pos.dashboard.new_customers',
    defaultMessage: 'New Customers'
  },
  dashboardPendingOrders: {
    id: 'pos.dashboard.pending_orders',
    defaultMessage: 'Pending Orders'
  },
  dashboardOrderItems: {
    id: 'pos.dashboard.order.items',
    defaultMessage: 'by {customer_name}, {nb_items, plural, one {one item} other {{nb_items, number} items}}'
  },
  dashboardWelcomeTitle: {
    id: 'pos.dashboard.welcome.title',
    defaultMessage: 'Welcome to react-admin demo'
  },
  dashboardWelcomeSubtitle: {
    id: 'pos.dashboard.welcome.subtitle',
    defaultMessage: 'This is the admin of an imaginary poster shop. Fell free to explore and modify the data - it\'s local to your computer, and will reset each time you reload.'
  },
  dashboardWelcomeAorButton: {
    id: 'pos.dashboard.welcome.aor_button',
    defaultMessage: 'react-admin site'
  },
  dashboardWelcomeDemoButton: {
    id: 'pos.dashboard.welcome.demo_button',
    defaultMessage: 'Source for this demo'
  }
});
const resourcesMessages = defineMessages({
  CustomerName: {
    id: 'resources.Customer.name',
    defaultMessage: '{smart_count, plural, one {Customer}, other {Customers}}'
  },
  CustomerFieldsCommands: {
    id: 'resources.Customer.fields.commands',
    defaultMessage: 'Orders'
  },
  CustomerFieldsGroups: {
    id: 'resources.Customer.fields.groups',
    defaultMessage: 'Segments'
  },
  CustomerFieldsLastSeenGte: {
    id: 'resources.Customer.fields.lastSeen_gte',
    defaultMessage: 'Visited Since'
  },
  CustomerFieldsName: {
    id: 'resources.Customer.fields.name',
    defaultMessage: 'Name'
  },
  CustomerFieldsLatestPurchase: {
    id: 'resources.Customer.fields.latestPurchase',
    defaultMessage: 'Latest Purchase'
  },
  CustomerFieldsHasOrdered: {
    id: 'resources.Customer.fields.hasOrdered',
    defaultMessage: 'Has Ordered'
  },
  CustomerFieldsHasNewsletter: {
    id: 'resources.Customer.fields.hasNewsletter',
    defaultMessage: 'Has Newsletter'
  },
  CustomerFieldsTotalSpent: {
    id: 'resources.Customer.fields.totalSpent',
    defaultMessage: 'Total spent'
  },
  CustomerTabsIdentity: {
    id: 'resources.Customer.tabs.identity',
    defaultMessage: 'Identity'
  },
  CustomerTabsAddress: {
    id: 'resources.Customer.tabs.address',
    defaultMessage: 'Address'
  },
  CustomerTabsOrders: {
    id: 'resources.Customer.tabs.orders',
    defaultMessage: 'Orders'
  },
  CustomerTabsReviews: {
    id: 'resources.Customer.tabs.reviews',
    defaultMessage: 'Reviews'
  },
  CustomerTabsStats: {
    id: 'resources.Customer.tabs.stats',
    defaultMessage: 'Stats'
  },
  CustomerPageDelete: {
    id: 'resources.Customer.page.delete',
    defaultMessage: 'Delete Customer'
  },
  CommandName: {
    id: 'resources.Command.name',
    defaultMessage: '{smart_count, plural, one {Order}, other {Orders}}'
  },
  CommandFieldsBasketDelivery: {
    id: 'resources.Command.fields.basket.delivery',
    defaultMessage: 'Delivery'
  },
  CommandFieldsBasketReference: {
    id: 'resources.Command.fields.basket.reference',
    defaultMessage: 'Reference'
  },
  CommandFieldsBasketQuantity: {
    id: 'resources.Command.fields.basket.quantity',
    defaultMessage: 'Quantity'
  },
  CommandFieldsBasketSum: {
    id: 'resources.Command.fields.basket.sum',
    defaultMessage: 'Sum'
  },
  CommandFieldsBasketTaxRate: {
    id: 'resources.Command.fields.basket.tax_rate',
    defaultMessage: 'Tax Rate'
  },
  CommandFieldsBasketTotal: {
    id: 'resources.Command.fields.basket.total',
    defaultMessage: 'Total'
  },
  CommandFieldsBasketUnitPrice: {
    id: 'resources.Command.fields.basket.unit_price',
    defaultMessage: 'Unit Price'
  },
  CommandFieldsCustomerId: {
    id: 'resources.Command.fields.customer.id',
    defaultMessage: 'Customer'
  },
  CommandFieldsDateGte: {
    id: 'resources.Command.fields.date_gte',
    defaultMessage: 'Passed Since'
  },
  CommandFieldsDateLte: {
    id: 'resources.Command.fields.date_lte',
    defaultMessage: 'Passed Before'
  },
  CommandFieldsTotalGte: {
    id: 'resources.Command.fields.total_gte',
    defaultMessage: 'Min amount'
  },
  CommandFieldsStatus: {
    id: 'resources.Command.fields.status',
    defaultMessage: 'Status'
  },
  CommandFieldsReturned: {
    id: 'resources.Command.fields.returned',
    defaultMessage: 'Returned'
  },
  ProductName: {
    id: 'resources.Product.name',
    defaultMessage: '{smart_count, plural, one {Poster}, other {Posters}}'
  },
  ProductFieldsCategoryId: {
    id: 'resources.Product.fields.category.id',
    defaultMessage: 'Category'
  },
  ProductFieldsHeightGte: {
    id: 'resources.Product.fields.height_gte',
    defaultMessage: 'Min height'
  },
  ProductFieldsHeightLte: {
    id: 'resources.Product.fields.height_lte',
    defaultMessage: 'Max height'
  },
  ProductFieldsHeight: {
    id: 'resources.Product.fields.height',
    defaultMessage: 'Height'
  },
  ProductFieldsImage: {
    id: 'resources.Product.fields.image',
    defaultMessage: 'Image'
  },
  ProductFieldsPrice: {
    id: 'resources.Product.fields.price',
    defaultMessage: 'Price'
  },
  ProductFieldsReference: {
    id: 'resources.Product.fields.reference',
    defaultMessage: 'Reference'
  },
  ProductFieldsStockLte: {
    id: 'resources.Product.fields.stock_lte',
    defaultMessage: 'Low Stock'
  },
  ProductFieldsStock: {
    id: 'resources.Product.fields.stock',
    defaultMessage: 'Stock'
  },
  ProductFieldsThumbnail: {
    id: 'resources.Product.fields.thumbnail',
    defaultMessage: 'Thumbnail'
  },
  ProductFieldsWidthGte: {
    id: 'resources.Product.fields.width_gte',
    defaultMessage: 'Min width'
  },
  ProductFieldsWidthLte: {
    id: 'resources.Product.fields.width_lte',
    defaultMessage: 'mx_width'
  },
  ProductFieldsWidth: {
    id: 'resources.Product.fields.width',
    defaultMessage: 'Width'
  },
  ProductTabsImage: {
    id: 'resources.Product.tabs.image',
    defaultMessage: 'Image'
  },
  ProductTabsDetails: {
    id: 'resources.Product.tabs.details',
    defaultMessage: 'Details'
  },
  ProductTabsDescription: {
    id: 'resources.Product.tabs.description',
    defaultMessage: 'Description'
  },
  ProductTabsReviews: {
    id: 'resources.Product.tabs.reviews',
    defaultMessage: 'Reviews'
  },
  CategoryName: {
    id: 'resources.Category.name',
    defaultMessage: '{smart_count, plural, one {Category}, other {Categories}}'
  },
  CategoryFieldsProducts: {
    id: 'resources.Category.fields.products',
    defaultMessage: 'Products'
  },
  ReviewName: {
    id: 'resources.Review.name',
    defaultMessage: '{smart_count, plural, one {Review}, other {Reviews}}'
  },
  ReviewFieldsCustomerId: {
    id: 'resources.Review.fields.customer.id',
    defaultMessage: 'Customer'
  },
  ReviewFieldsCommandId: {
    id: 'resources.Review.fields.command.id',
    defaultMessage: 'Order'
  },
  ReviewFieldsProductId: {
    id: 'resources.Review.fields.product.id',
    defaultMessage: 'Product'
  },
  ReviewFieldsDateGte: {
    id: 'resources.Review.fields.date_gte',
    defaultMessage: 'Posted since'
  },
  ReviewFieldsDateLte: {
    id: 'resources.Review.fields.date_lte',
    defaultMessage: 'Posted before'
  },
  ReviewFieldsDate: {
    id: 'resources.Review.fields.date',
    defaultMessage: 'Date'
  },
  ReviewFieldsComment: {
    id: 'resources.Review.fields.comment',
    defaultMessage: 'Comment'
  },
  ReviewFieldsRating: {
    id: 'resources.Review.fields.rating',
    defaultMessage: 'Rating'
  },
  ReviewActionAccept: {
    id: 'resources.Review.action.accept',
    defaultMessage: 'Accept'
  },
  ReviewActionReject: {
    id: 'resources.Review.action.reject',
    defaultMessage: 'Reject'
  },
  ReviewNotificationApprovedSuccess: {
    id: 'resources.Review.notification.approved_success',
    defaultMessage: 'Review approved'
  },
  ReviewNotificationApprovedError: {
    id: 'resources.Review.notification.approved_error',
    defaultMessage: 'Error: Review not approved'
  },
  ReviewNotificationRejectedSuccess: {
    id: 'resources.Review.notification.rejected_success',
    defaultMessage: 'Review rejected'
  },
  ReviewNotificationRejectedError: {
    id: 'resources.Review.notification.rejected_error',
    defaultMessage: 'Error: Review not rejected'
  },
  SegmentName: {
    id: 'resources.Segment.name',
    defaultMessage: 'Segments'
  },
  SegmentFieldsCustomers: {
    id: 'resources.Segment.fields.customers',
    defaultMessage: 'Customers'
  },
  SegmentFieldsName: {
    id: 'resources.Segment.fields.name',
    defaultMessage: 'Name'
  },
  SegmentDataCompulsive: {
    id: 'resources.Segment.data.compulsive',
    defaultMessage: 'Compulsive'
  },
  SegmentDataCollector: {
    id: 'resources.Segment.data.collector',
    defaultMessage: 'Collector'
  },
  SegmentDataOrderedOnce: {
    id: 'resources.Segment.data.ordered_once',
    defaultMessage: 'Ordered once'
  },
  SegmentDataRegular: {
    id: 'resources.Segment.data.regular',
    defaultMessage: 'Regular'
  },
  SegmentDataReturns: {
    id: 'resources.Segment.data.returns',
    defaultMessage: 'Returns'
  },
  SegmentDataReviewer: {
    id: 'resources.Segment.data.reviewer',
    defaultMessage: 'Reviewer'
  }
});

// we just convert quickly the file so we don't need to use babel-plugin-react-intl
const obj = {};
Object.values({ ...posMessages, ...resourcesMessages }).forEach((value) => {
  obj[value.id] = value.defaultMessage;
});

export default {
  ...englishMessages,
  ...obj,
};
