import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';
import Notification from './Notification';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Menu from './Menu';

injectTapEventPlugin();

const Layout = ({ isLoading, children, route }) => (
    <MuiThemeProvider>
        <div>
            <AppBar title="Admin on REST" iconElementRight={isLoading ? <CircularProgress color="#fff" size={0.5} /> : <span/>} />
            <div className="body" style={{ display: 'flex', flexDirection: 'row' }}>
                <Menu resources={route.resources} />
                <div style={{ flex: 1 }}>{children}</div>
            </div>
            <Notification />
        </div>
    </MuiThemeProvider>
);

Layout.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    children: PropTypes.node,
    route: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return { isLoading: state.admin.loading > 0 };
}

export default connect(
  mapStateToProps,
)(Layout);
