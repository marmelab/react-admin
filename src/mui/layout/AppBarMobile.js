import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import MuiAppBar from 'material-ui/AppBar';
import muiThemeable from 'material-ui/styles/muiThemeable';
import compose from 'recompose/compose';
import { toggleSidebar as toggleSidebarAction } from '../../actions';

const style = {
    bar: {
        height: '3em',
        position: 'absolute',
        top: 0,
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
    link: {
        color: '#fff',
        textDecoration: 'none',
    },
};

const AppBarMobile = ({ title, toggleSidebar }) => (
    <MuiAppBar
        style={style.bar}
        titleStyle={style.title}
        iconStyleLeft={style.icon}
        title={<Link to="/" style={style.link}>{title}</Link>}
        onLeftIconButtonTouchTap={toggleSidebar}
    />
);

AppBarMobile.propTypes = {
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ]).isRequired,
    toggleSidebar: PropTypes.func.isRequired,
};

const enhance = compose(
    muiThemeable(), // force redraw on theme change
    connect(null, {
        toggleSidebar: toggleSidebarAction,
    }),
);

export default enhance(AppBarMobile);
