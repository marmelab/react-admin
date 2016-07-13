import React from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import { Link } from 'react-router';

import Notification from '../../src/components/material-ui/layout/Notification';

const Layout = ({ isLoading, children }) => (
    <MuiThemeProvider>
        <div>
            <AppBar title="React Admin" iconElementRight={isLoading ? <CircularProgress color="#fff" size={0.5} /> : <span />} />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Paper style={{ flexBasis: '15em' }}>
                    <List>
                        <ListItem containerElement={<Link to="/posts" />} primaryText="Posts" />
                        <ListItem containerElement={<Link to="/comments" />} primaryText="Comments" />
                    </List>
                    <Notification />
                </Paper>
                <div style={{ flex: 1 }}>{children}</div>
            </div>
        </div>
    </MuiThemeProvider>
);

function mapStateToProps({ loading }) {
    return { isLoading: loading > 0 };
}

export default connect(
  mapStateToProps,
)(Layout);
