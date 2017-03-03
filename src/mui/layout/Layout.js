import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import autoprefixer from 'material-ui/utils/autoprefixer';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import withWidth from 'material-ui/utils/withWidth';
import compose from 'recompose/compose';
import injectTapEventPlugin from 'react-tap-event-plugin';
import AppBar from './AppBar';
import Notification from './Notification';
import defaultTheme from '../defaultTheme';
import {
    toggleSidebar as toggleSidebarAction,
    setSidebarVisibility as setSidebarVisibilityAction,
} from '../../actions';

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
    bodySmall: {
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: '2em',
    },
    contentSmall: {
        flex: 1,
    },
    loader: {
        position: 'absolute',
        top: 0,
        right: 0,
        margin: 16,
        zIndex: 1200,
    },
};

const prefixedStyles = {};

class Layout extends Component {
    componentWillMount() {
        if (this.props.width !== 1) {
            this.props.setSidebarVisibility(true);
        }
    }

    render() {
        const {
            children,
            isLoading,
            menu,
            route,
            setSidebarVisibility,
            sidebarOpen,
            theme,
            title,
            toggleSidebar,
            width,
        } = this.props;
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
                    { width !== 1 && <AppBar title={title} onLeftIconButtonTouchTap={toggleSidebar} />}
                    <div className="body" style={width === 1 ? prefixedStyles.bodySmall : prefixedStyles.body}>
                        <div style={width === 1 ? prefixedStyles.contentSmall : prefixedStyles.content}>{children}</div>
                        {React.cloneElement(menu, {
                            open: sidebarOpen,
                            width,
                        })}
                    </div>
                    <Notification />
                    {isLoading && <CircularProgress
                        color="#fff"
                        size={30}
                        thickness={2}
                        style={styles.loader}
                    />}
                </div>
            </MuiThemeProvider>
        );
    }
}

Layout.propTypes = {
    authClient: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    isLoading: PropTypes.bool.isRequired,
    children: PropTypes.node,
    menu: PropTypes.element,
    route: PropTypes.object.isRequired,
    setSidebarVisibility: PropTypes.func.isRequired,
    sidebarOpen: PropTypes.bool,
    title: PropTypes.string.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    width: PropTypes.number,
};

Layout.defaultProps = {
    theme: defaultTheme,
};

function mapStateToProps(state) {
    return {
        isLoading: state.admin.loading > 0,
        sidebarOpen: state.admin.ui.sidebarOpen,
    };
}

const enhance = compose(
    withWidth(),
    connect(mapStateToProps, {
        toggleSidebar: toggleSidebarAction,
        setSidebarVisibility: setSidebarVisibilityAction,
    }),
);

export default enhance(Layout);
