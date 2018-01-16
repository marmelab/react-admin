import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MuiAppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import compose from 'recompose/compose';
import classnames from 'classnames';

import { toggleSidebar } from '../../actions';

const styles = {
    bar: {
        height: '3em',
        position: 'absolute',
        top: 0,
    },
    title: {
        fontSize: '1.25em',
        lineHeight: '2.5em',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
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

const AppBarMobile = ({
    classes,
    className,
    title,
    toggleSidebar,
    ...rest
}) => (
    <MuiAppBar className={classnames(classes.bar, className)} {...rest}>
        <Toolbar>
            <IconButton
                color="contrast"
                aria-label="open drawer"
                onClick={toggleSidebar}
                className={classes.icon}
            >
                <MenuIcon />
            </IconButton>
            <Typography className={classes.title} type="title" color="inherit">
                {title}
            </Typography>
        </Toolbar>
    </MuiAppBar>
);

AppBarMobile.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
    toggleSidebar: PropTypes.func.isRequired,
};

const enhance = compose(connect(null, { toggleSidebar }), withStyles(styles));

export default enhance(AppBarMobile);
