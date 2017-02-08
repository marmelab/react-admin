import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import autoprefixer from 'material-ui/utils/autoprefixer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Notification from './Notification';
import Menu from './Menu';

injectTapEventPlugin();

const Layout = ({ isLoading, children, route, title, theme }) => {
    const Title = <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>{title}</Link>;
    const RightElement = isLoading ? <CircularProgress color="#fff" size={30} thickness={2} style={{ margin: 8 }} /> : <span />;
    const muiTheme = getMuiTheme(theme);
    const prefix = autoprefixer(muiTheme);
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
            <div style={prefix({ display: 'flex', flexDirection: 'column', minHeight: '100vh' })}>
                <AppBar title={Title} iconElementRight={RightElement} />
                <div className="body" style={prefix({ display: 'flex', flex: '1', backgroundColor: '#edecec' })}>
                    <div style={prefix({ flex: 1 })}>{children}</div>
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
    theme: {
        tabs: {
            backgroundColor: 'white',
            selectedTextColor: '#00bcd4',
            textColor: '#757575',
        },
        inkBar: {
            backgroundColor: '#00bcd4',
        },
    },
};

function mapStateToProps(state) {
    return { isLoading: state.admin.loading > 0 };
}

export default connect(
  mapStateToProps,
)(Layout);
