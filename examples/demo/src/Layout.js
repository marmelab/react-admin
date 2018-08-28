import React from 'react';
import { connect } from 'react-redux';
import { Layout, Sidebar } from 'react-admin';
import AppBar from './AppBar';

const CustomSidebar = props => <Sidebar size={200} {...props} />;
const CustomLayout = props => (
    <Layout appBar={AppBar} sidebar={CustomSidebar} {...props} />
);

const darkTheme = {
    palette: {
        type: 'dark', // Switching the dark mode on is a single property value change.
    },
};

const lightTheme = {
    palette: {
        secondary: {
            light: '#5f5fc4',
            main: '#283593',
            dark: '#001064',
            contrastText: '#fff',
        },
    },
};

export default connect(
    state => ({
        theme: state.theme === 'dark' ? darkTheme : lightTheme,
    }),
    {}
)(CustomLayout);
