import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import withWidth, { SMALL } from 'material-ui/utils/withWidth';
import autoprefixer from 'material-ui/utils/autoprefixer';
import injectTapEventPlugin from 'react-tap-event-plugin';
import compose from 'recompose/compose';
import AppBar from './AppBar';
import Notification from './Notification';
import Menu from './Menu';
import defaultTheme from '../defaultTheme';

injectTapEventPlugin();

const styles = {
    mainWithMargin: {
        marginLeft: 256,
        transition: 'margin-left 0.2s',
    },
    main: {
        transition: 'margin-left 0.2s',
    },
};

class Layout extends Component {
    state = {
        navDrawerOpen: true,
    };

    componentWillMount() {
        this.hideSidebarIfNeeded(this.props.width);
    }

    componentWillReceiveProps(nextProps) {
        this.hideSidebarIfNeeded(nextProps.width);
    }

    toggleSidebar = () => {
        this.setState({
            navDrawerOpen: !this.state.navDrawerOpen,
        });
    };

    navHiddenBySmallScreen = false;

    hideSidebarIfNeeded(width) {
        if (width === SMALL) {
            if (!this.navHiddenBySmallScreen) {
                this.setState({
                    navDrawerOpen: false,
                });
                this.navHiddenBySmallScreen = true;
            }
        } else {
            this.navHiddenBySmallScreen = false;
        }
    }

    render() {
        const { isLoading, children, route, title, theme, logout, width } = this.props;
        const muiTheme = getMuiTheme(theme);
        const prefix = autoprefixer(muiTheme);
        const { navDrawerOpen } = this.state;
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={prefix({ display: 'flex', flexDirection: 'column', minHeight: '100vh' })}>
                    <AppBar title={title} isLoading={isLoading} onLeftIconButtonTouchTap={this.toggleSidebar} />
                    <div className="body" style={prefix({ flex: '1', backgroundColor: '#edecec' })}>
                        <div style={navDrawerOpen && width !== SMALL ? styles.mainWithMargin : styles.main}>{children}</div>
                        <Menu resources={route.resources} logout={logout} open={navDrawerOpen} width={width} toggleSidebar={this.toggleSidebar} />
                    </div>
                    <Notification />
                </div>
            </MuiThemeProvider>
        );
    }
}

Layout.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    children: PropTypes.node,
    logout: PropTypes.element,
    route: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
};

Layout.defaultProps = {
    theme: defaultTheme,
};

function mapStateToProps(state) {
    return { isLoading: state.admin.loading > 0 };
}

const enhance = compose(
    connect(mapStateToProps),
    withWidth(),
);

export default enhance(Layout);
