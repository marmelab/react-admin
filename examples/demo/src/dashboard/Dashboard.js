import React, { Component } from 'react';
import { GET_LIST, GET_MANY, Responsive, withDataProvider } from 'react-admin';
import compose from 'recompose/compose';
import { connect } from 'react-redux';

import Welcome from './Welcome';
import MonthlyRevenue from './MonthlyRevenue';
import NbNewOrders from './NbNewOrders';
import PendingOrders from './PendingOrders';
import PendingReviews from './PendingReviews';
import NewCustomers from './NewCustomers';

const styles = {
    flex: { display: 'flex' },
    flexColumn: { display: 'flex', flexDirection: 'column' },
    leftCol: { flex: 1, marginRight: '1em' },
    rightCol: { flex: 1, marginLeft: '1em' },
    singleCol: { marginTop: '2em', marginBottom: '2em' },
};

class Dashboard extends Component {
    state = {};

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        // handle refresh
        if (this.props.version !== prevProps.version) {
            this.fetchData();
        }
    }

    fetchData() {
        this.fetchOrders();
        this.fetchReviews();
        this.fetchCustomers();
    }

    async fetchOrders() {
        const { dataProvider } = this.props;
        const aMonthAgo = new Date();
        aMonthAgo.setDate(aMonthAgo.getDate() - 30);
        const { data: recentOrders } = await dataProvider(GET_LIST, 'commands', {
            filter: { date_gte: aMonthAgo.toISOString() },
            sort: { field: 'date', order: 'DESC' },
            pagination: { page: 1, perPage: 50 },
        });
        const aggregations = recentOrders
            .filter(order => order.status !== 'cancelled')
            .reduce(
                (stats, order) => {
                    if (order.status !== 'cancelled') {
                        stats.revenue += order.total;
                        stats.nbNewOrders++;
                    }
                    if (order.status === 'ordered') {
                        stats.pendingOrders.push(order);
                    }
                    return stats;
                },
                {
                    revenue: 0,
                    nbNewOrders: 0,
                    pendingOrders: [],
                }
            );
        this.setState({
            revenue: aggregations.revenue.toLocaleString(undefined, {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }),
            nbNewOrders: aggregations.nbNewOrders,
            pendingOrders: aggregations.pendingOrders,
        });
        const { data: customers } = await dataProvider(GET_MANY, 'customers', {
            ids: aggregations.pendingOrders.map(order => order.customer_id),
        });
        this.setState({
            pendingOrdersCustomers: customers.reduce((prev, customer) => {
                prev[customer.id] = customer; // eslint-disable-line no-param-reassign
                return prev;
            }, {}),
        });
    }

    async fetchReviews() {
        const { dataProvider } = this.props;
        const { data: reviews } = await dataProvider(GET_LIST, 'reviews', {
            filter: { status: 'pending' },
            sort: { field: 'date', order: 'DESC' },
            pagination: { page: 1, perPage: 100 },
        });
        const nbPendingReviews = reviews.reduce(nb => ++nb, 0);
        const pendingReviews = reviews.slice(0, Math.min(10, reviews.length));
        this.setState({ pendingReviews, nbPendingReviews });
        const { data: customers } = await dataProvider(GET_MANY, 'customers', {
            ids: pendingReviews.map(review => review.customer_id),
        });
        this.setState({
            pendingReviewsCustomers: customers.reduce((prev, customer) => {
                prev[customer.id] = customer; // eslint-disable-line no-param-reassign
                return prev;
            }, {}),
        });
    }

    async fetchCustomers() {
        const { dataProvider } = this.props;
        const aMonthAgo = new Date();
        aMonthAgo.setDate(aMonthAgo.getDate() - 30);
        const { data: newCustomers } = await dataProvider(GET_LIST, 'customers', {
            filter: {
                has_ordered: true,
                first_seen_gte: aMonthAgo.toISOString(),
            },
            sort: { field: 'first_seen', order: 'DESC' },
            pagination: { page: 1, perPage: 100 },
        });
        this.setState({
            newCustomers,
            nbNewCustomers: newCustomers.reduce(nb => ++nb, 0),
        });
    }

    render() {
        const {
            nbNewCustomers,
            nbNewOrders,
            nbPendingReviews,
            newCustomers,
            pendingOrders,
            pendingOrdersCustomers,
            pendingReviews,
            pendingReviewsCustomers,
            revenue,
        } = this.state;
        return (
            <Responsive
                xsmall={
                    <div>
                        <div style={styles.flexColumn}>
                            <div style={{ marginBottom: '2em' }}>
                                <Welcome />
                            </div>
                            <div style={styles.flex}>
                                <MonthlyRevenue value={revenue} />
                                <NbNewOrders value={nbNewOrders} />
                            </div>
                            <div style={styles.singleCol}>
                                <PendingOrders orders={pendingOrders} customers={pendingOrdersCustomers} />
                            </div>
                        </div>
                    </div>
                }
                small={
                    <div style={styles.flexColumn}>
                        <div style={styles.singleCol}>
                            <Welcome />
                        </div>
                        <div style={styles.flex}>
                            <MonthlyRevenue value={revenue} />
                            <NbNewOrders value={nbNewOrders} />
                        </div>
                        <div style={styles.singleCol}>
                            <PendingOrders orders={pendingOrders} customers={pendingOrdersCustomers} />
                        </div>
                    </div>
                }
                medium={
                    <div style={styles.flex}>
                        <div style={styles.leftCol}>
                            <div style={styles.flex}>
                                <MonthlyRevenue value={revenue} />
                                <NbNewOrders value={nbNewOrders} />
                            </div>
                            <div style={styles.singleCol}>
                                <Welcome />
                            </div>
                            <div style={styles.singleCol}>
                                <PendingOrders orders={pendingOrders} customers={pendingOrdersCustomers} />
                            </div>
                        </div>
                        <div style={styles.rightCol}>
                            <div style={styles.flex}>
                                <PendingReviews
                                    nb={nbPendingReviews}
                                    reviews={pendingReviews}
                                    customers={pendingReviewsCustomers}
                                />
                                <NewCustomers nb={nbNewCustomers} visitors={newCustomers} />
                            </div>
                        </div>
                    </div>
                }
            />
        );
    }
}

const mapStateToProps = state => ({
    version: state.admin.ui.viewVersion,
});

export default compose(
    connect(mapStateToProps),
    withDataProvider
)(Dashboard);
