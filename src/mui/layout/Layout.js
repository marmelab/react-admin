import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexRoute } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import autoprefixer from 'material-ui/utils/autoprefixer';
import CircularProgress from 'material-ui/CircularProgress';
import withWidth from 'material-ui/utils/withWidth';
import compose from 'recompose/compose';
import injectTapEventPlugin from 'react-tap-event-plugin';
import CrudRoute from '../../CrudRoute';
import AppBar from './AppBar';
import Sidebar from './Sidebar';
import Notification from './Notification';
import defaultTheme from '../defaultTheme';
import { setSidebarVisibility as setSidebarVisibilityAction } from '../../actions';

injectTapEventPlugin();

const styles = {
    wrapper: {
        // Avoid IE bug with Flexbox, see #467
        display: 'flex',
        flexDirection: 'column',
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    body: {
        backgroundColor: '#edecec',
        display: 'flex',
        flex: 1,
        overflowY: 'hidden',
        overflowX: 'scroll',
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
        paddingTop: '3em',
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
            customRoutes,
            dashboard,
            isLoading,
            menu,
            onEnter,
            resources,
            theme,
            title,
            width,
        } = this.props;
        const muiTheme = getMuiTheme(theme);
        if (!prefixedStyles.main) {
            // do this once because user agent never changes
            const prefix = autoprefixer(muiTheme);
            prefixedStyles.wrapper = prefix(styles.wrapper);
            prefixedStyles.main = prefix(styles.main);
            prefixedStyles.body = prefix(styles.body);
            prefixedStyles.bodySmall = prefix(styles.bodySmall);
            prefixedStyles.content = prefix(styles.content);
            prefixedStyles.contentSmall = prefix(styles.contentSmall);
        }
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={prefixedStyles.wrapper}>
                    <div style={prefixedStyles.main}>
                        { width !== 1 && <AppBar title={title} />}
                        <div className="body" style={width === 1 ? prefixedStyles.bodySmall : prefixedStyles.body}>
                            <div style={width === 1 ? prefixedStyles.contentSmall : prefixedStyles.content}>
                                {customRoutes && customRoutes()}
                                {dashboard && <IndexRoute component={dashboard} onEnter={onEnter()} />}
                                {resources.map(resource =>
                                    <CrudRoute
                                        key={resource.name}
                                        path={resource.name}
                                        list={resource.list}
                                        create={resource.create}
                                        edit={resource.edit}
                                        show={resource.show}
                                        remove={resource.remove}
                                        options={resource.options}
                                        onEnter={onEnter}
                                    />
                                )}
                            </div>
                            <Sidebar theme={theme}>
                                {menu}
                            </Sidebar>
                        </div>
                        <Notification />
                        {isLoading && <CircularProgress
                            className="app-loader"
                            color="#fff"
                            size={width === 1 ? 20 : 30}
                            thickness={2}
                            style={styles.loader}
                        />}
                    </div>
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
    setSidebarVisibility: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
    width: PropTypes.number,
};

Layout.defaultProps = {
    theme: defaultTheme,
};

function mapStateToProps(state) {
    return {
        isLoading: state.admin.loading > 0,
    };
}

const enhance = compose(
    connect(mapStateToProps, {
        setSidebarVisibility: setSidebarVisibilityAction,
    }),
    withWidth(),
);

export default enhance(Layout);
