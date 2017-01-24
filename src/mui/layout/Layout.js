import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import AppBar from './AppBar';
import Notification from './Notification';
import Menu from './Menu';
import defaultTheme from '../defaultTheme';

injectTapEventPlugin();

const Layout = ({ isLoading, children, route, title, theme }) => {
    const muiTheme = getMuiTheme(theme);

    return (
        <MuiThemeProvider muiTheme={muiTheme}>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <AppBar title={title} isLoading={isLoading} />
                <div className="body" style={{ display: 'flex', flex: '1', backgroundColor: '#edecec' }}>
                    <div style={{ flex: 1 }}>{children}</div>
                    <Menu resources={route.resources} />
                </div>
                <Notification />
            </div>
        </MuiThemeProvider>
    );
};

Layout.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    children: PropTypes.node,
    route: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
};
Layout.defaultProps = {
    theme: defaultTheme
};

function mapStateToProps(state) {
    return { isLoading: state.admin.loading > 0 };
}

export default connect(
  mapStateToProps,
)(Layout);
