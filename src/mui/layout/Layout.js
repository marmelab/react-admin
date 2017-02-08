import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import autoprefixer from 'material-ui/utils/autoprefixer';
import injectTapEventPlugin from 'react-tap-event-plugin';
import AppBar from './AppBar';
import Notification from './Notification';
import Menu from './Menu';
import defaultTheme from '../defaultTheme';

injectTapEventPlugin();

const Layout = ({ isLoading, children, route, title, theme, logout }) => {
    const muiTheme = getMuiTheme(theme);
    const prefix = autoprefixer(muiTheme);
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
            <div style={prefix({ display: 'flex', flexDirection: 'column', minHeight: '100vh' })}>
                <AppBar title={title} isLoading={isLoading} />
                <div className="body" style={prefix({ display: 'flex', flex: '1', backgroundColor: '#edecec' })}>
                    <div style={prefix({ flex: 1 })}>{children}</div>
                    <Menu resources={route.resources} logout={logout} />
                </div>
                <Notification />
            </div>
        </MuiThemeProvider>
    );
};

Layout.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    children: PropTypes.node,
    logout: PropTypes.element,
    route: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
};

Layout.defaultProps = {
    theme: defaultTheme,
};

function mapStateToProps(state) {
    return { isLoading: state.admin.loading > 0 };
}

export default connect(
  mapStateToProps,
)(Layout);
