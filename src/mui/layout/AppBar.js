import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import MuiAppBar from 'material-ui/AppBar';
import muiThemeable from 'material-ui/styles/muiThemeable';
import withWidth from 'material-ui/utils/withWidth';
import compose from 'recompose/compose';
import { toggleSidebar as toggleSidebarAction } from '../../actions';

const style = {
    mobile: {
        bar: {
            height: '3em',
            transition: 'all 1s',
        },
        title: {
            fontSize: '1.25em',
            lineHeight: '2.5em',
        },
        icon: {
            marginTop: 0,
            marginRight: 0,
            marginLeft: '-24px',
        },
    },
};

const AppBar = ({ title, toggleSidebar, width }) => {
    const Title = <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>{title}</Link>;
    return width === 1
        ? (<MuiAppBar
            style={style.mobile.bar}
            titleStyle={style.mobile.title}
            iconStyleLeft={style.mobile.icon}
            title={Title}
            onLeftIconButtonTouchTap={toggleSidebar}
        />)
        : (<MuiAppBar
            title={Title}
            onLeftIconButtonTouchTap={toggleSidebar}
        />);
};

AppBar.propTypes = {
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ]).isRequired,
    toggleSidebar: PropTypes.func.isRequired,
    width: PropTypes.number
};

const enhance = compose(
    muiThemeable(), // force redraw on theme change
    connect(null, {
        toggleSidebar: toggleSidebarAction,
    }),
    withWidth(),
);

export default enhance(AppBar);
