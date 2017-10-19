import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MuiAppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import compose from 'recompose/compose';
import { toggleSidebar as toggleSidebarAction } from '../../actions';

const AppBar = ({ title, toggleSidebar }) => (
    <MuiAppBar onLeftIconButtonTouchTap={toggleSidebar}>
        <Toolbar>
            <Typography type="title" color="inherit">
                {title}
            </Typography>
        </Toolbar>
    </MuiAppBar>
);

AppBar.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
    toggleSidebar: PropTypes.func.isRequired,
};

const enhance = compose(
    connect(null, {
        toggleSidebar: toggleSidebarAction,
    })
);

export default enhance(AppBar);
