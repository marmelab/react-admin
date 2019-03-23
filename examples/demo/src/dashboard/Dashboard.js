import React from 'react';
import { Responsive } from 'react-admin';

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
    singleCol: { marginTop: '2em', marginBottom: '2em' }
};

const Dashboard = () => (
    <Responsive
        xsmall={
            <div>
                <div style={styles.flexColumn}>
                    <div style={{ marginBottom: '2em' }}>
                        <Welcome />
                    </div>
                    <div style={styles.flex}>
                        <MonthlyRevenue />
                        <NbNewOrders />
                    </div>
                    <div style={styles.singleCol}>
                        <PendingOrders />
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
                    <MonthlyRevenue />
                    <NbNewOrders />
                </div>
                <div style={styles.singleCol}>
                    <PendingOrders />
                </div>
            </div>
        }
        medium={
            <div style={styles.flex}>
                <div style={styles.leftCol}>
                    <div style={styles.flex}>
                        <MonthlyRevenue />
                        <NbNewOrders />
                    </div>
                    <div style={styles.singleCol}>
                        <Welcome />
                    </div>
                    <div style={styles.singleCol}>
                        <PendingOrders />
                    </div>
                </div>
                <div style={styles.rightCol}>
                    <div style={styles.flex}>
                        <PendingReviews />
                        <NewCustomers />
                    </div>
                </div>
            </div>
        }
    />
);

export default Dashboard;
