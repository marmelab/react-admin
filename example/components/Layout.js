import React from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import PostIcon from 'material-ui/svg-icons/action/book';
import CommentIcon from 'material-ui/svg-icons/communication/chat-bubble';
import { Link } from 'react-router';

import { Notification } from 'admin-on-rest/mui';

const Layout = ({ isLoading, children }) => (
    <MuiThemeProvider>
        <div>
            <AppBar title="Admin on REST" iconElementRight={isLoading ? <CircularProgress color="#fff" size={0.5} /> : <span />} />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Paper style={{ flexBasis: '15em' }}>
                    <List>
                        <ListItem containerElement={<Link to="/posts" />} primaryText="Posts" leftIcon={<PostIcon />} />
                        <ListItem containerElement={<Link to="/comments" />} primaryText="Comments" leftIcon={<CommentIcon />} />
                    </List>
                    <Notification />
                </Paper>
                <div style={{ flex: 1 }}>{children}</div>
            </div>
        </div>
    </MuiThemeProvider>
);

function mapStateToProps(state) {
    return { isLoading: state.admin.loading > 0 };
}

export default connect(
  mapStateToProps,
)(Layout);
