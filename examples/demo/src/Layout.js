import React from 'react';
import { connect } from 'react-redux';
import { Layout } from 'react-admin';
import AppBar from './AppBar';

const CustomLayout = props => <Layout appBar={AppBar} {...props} />;

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
