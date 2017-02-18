import React, { Component, PropTypes } from 'react';
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

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    body: {
        backgroundColor: '#edecec',
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
    },
    content: {
        flex: 1,
    },
};

const prefixedStyles = {};

class Layout extends Component {
    state = {
        sidebarOpen: true,
    };

    toggleSidebar = () => {
        this.setState({ sidebarOpen: !this.state.sidebarOpen });
    }

    render() {
        const { isLoading, children, route, title, theme, logout } = this.props;
        const { sidebarOpen } = this.state;
        const muiTheme = getMuiTheme(theme);
        if (!prefixedStyles.main) {
            // do this once because user agent never changes
            const prefix = autoprefixer(muiTheme);
            prefixedStyles.main = prefix(styles.main);
            prefixedStyles.body = prefix(styles.body);
            prefixedStyles.content = prefix(styles.content);
        }
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={prefixedStyles.main}>
                    <AppBar title={title} isLoading={isLoading} onLeftIconButtonTouchTap={this.toggleSidebar} />
                    <div className="body" style={prefixedStyles.body}>
                        <Menu resources={route.resources} logout={logout} open={sidebarOpen} />
                        <div style={prefixedStyles.content}>{children}</div>
                    </div>
                    <Notification />
                </div>
            </MuiThemeProvider>
        );
    }
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
