import React from 'react';
import { connect } from 'react-redux';
import { Layout, Sidebar } from 'react-admin';
import AppBar from './AppBar';
import { darkTheme, lightTheme } from './themes';

const CustomSidebar = props => <Sidebar size={200} {...props} />;
const CustomLayout = props => (
    <Layout appBar={AppBar} sidebar={CustomSidebar} {...props} />
);

export default connect(
    state => ({
        theme: state.theme === 'dark' ? darkTheme : lightTheme,
    }),
    {}
)(CustomLayout);
