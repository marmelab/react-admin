import englishMessages from 'ra-language-english';

export default {
    ...englishMessages,
    pos: {
        search: 'Search',
        configuration: 'Configuration',
        language: 'Language',
        theme: {
            name: 'Theme',
            light: 'Light',
            dark: 'Dark',
        },
        dashboard: {
            monthly_revenue: 'Monthly Revenue',
            new_orders: 'New Orders',
            pending_reviews: 'Pending Reviews',
            new_customers: 'New Customers',
            pending_orders: 'Pending Orders',
            order: {
                items:
                    'by %{customer_name}, one item |||| by %{customer_name}, %{nb_items} items',
            },
            welcome: {
                title: 'Welcome to react-admin demo',
                subtitle:
                    "This is the admin of an imaginary poster shop. Fell free to explore and modify the data - it's local to your computer, and will reset each time you reload.",
                aor_button: 'react-admin site',
                demo_button: 'Source for this demo',
            },
        },
    },
    resources: {
        Customer: {
            name: 'Customer |||| Customers',
            fields: {
                commands: 'Orders',
                groups: 'Segments',
                lastSeen_gte: 'Visited Since',
                name: 'Name',
                latestPurchase: 'Latest Purchase',
                hasOrdered: 'Has Ordered',
                hasNewsletter: 'Has Newsletter',
                totalSpent: 'Total spent',
            },
            tabs: {
                identity: 'Identity',
                address: 'Address',
                orders: 'Orders',
                reviews: 'Reviews',
                stats: 'Stats',
            },
            page: {
                delete: 'Delete Customer',
            },
        },
        Command: {
            name: 'Order |||| Orders',
            fields: {
                basket: {
                    delivery: 'Delivery',
                    reference: 'Reference',
                    quantity: 'Quantity',
                    sum: 'Sum',
                    tax_rate: 'Tax Rate',
                    total: 'Total',
                    unit_price: 'Unit Price',
                },
                'customer.id': 'Customer',
                date_gte: 'Passed Since',
                date_lte: 'Passed Before',
                total_gte: 'Min amount',
                status: 'Status',
                returned: 'Returned',
            },
        },
        Product: {
            name: 'Poster |||| Posters',
            fields: {
                'category.id': 'Category',
                height_gte: 'Min height',
                height_lte: 'Max height',
                height: 'Height',
                image: 'Image',
                price: 'Price',
                reference: 'Reference',
                stock_lte: 'Low Stock',
                stock: 'Stock',
                thumbnail: 'Thumbnail',
                width_gte: 'Min width',
                width_lte: 'mx_width',
                width: 'Width',
            },
            tabs: {
                image: 'Image',
                details: 'Details',
                description: 'Description',
                reviews: 'Reviews',
            },
        },
        Category: {
            name: 'Category |||| Categories',
            fields: {
                products: 'Products',
            },
        },
        Review: {
            name: 'Review |||| Reviews',
            fields: {
                'customer.id': 'Customer',
                'command.id': 'Order',
                'product.id': 'Product',
                date_gte: 'Posted since',
                date_lte: 'Posted before',
                date: 'Date',
                comment: 'Comment',
                rating: 'Rating',
            },
            action: {
                accept: 'Accept',
                reject: 'Reject',
            },
            notification: {
                approved_success: 'Review approved',
                approved_error: 'Error: Review not approved',
                rejected_success: 'Review rejected',
                rejected_error: 'Error: Review not rejected',
            },
        },
        Segment: {
            name: 'Segments',
            fields: {
                customers: 'Customers',
                name: 'Name',
            },
            data: {
                compulsive: 'Compulsive',
                collector: 'Collector',
                ordered_once: 'Ordered once',
                regular: 'Regular',
                returns: 'Returns',
                reviewer: 'Reviewer',
            },
        },
    },
};
