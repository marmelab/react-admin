import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import classnames from 'classnames';
import { setSidebarVisibility } from 'ra-core';

import Responsive from './Responsive';

export const DRAWER_WIDTH = 240;

const styles = theme => ({
    drawerPaper: {
        position: 'relative',
        height: 'auto',
        width: DRAWER_WIDTH,
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: 'transparent',
        borderRight: 'none',
        marginTop: '3.5em',
        [theme.breakpoints.only('xs')]: {
            marginTop: 0,
            height: '100vh',
            position: 'inherit',
            backgroundColor: theme.palette.background.default,
        },
        [theme.breakpoints.up('md')]: {
            border: 'none',
            marginTop: '4.5em',
        },
    },
    drawerPaperClose: {
        width: 55,
    },
});

// We shouldn't need PureComponent here as it's connected
// but for some reason it keeps rendering even though mapStateToProps returns the same object
class Sidebar extends PureComponent {
    componentWillMount() {
        const { width, setSidebarVisibility } = this.props;
        if (width !== 'xs' && width !== 'sm') {
            setSidebarVisibility(true);
        }
    }

    handleClose = () => this.props.setSidebarVisibility(false);

    toggleSidebar = () => this.props.setSidebarVisibility(!this.props.open);

    render() {
        const {
            children,
            classes,
            open,
            setSidebarVisibility,
            width,
            ...rest
        } = this.props;

        return (
            <Responsive
                xsmall={
                    <Drawer
                        variant="temporary"
                        open={open}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        onClose={this.toggleSidebar}
                        {...rest}
                    >
                        {React.cloneElement(children, {
                            onMenuClick: this.handleClose,
                            open
                        })}
                    </Drawer>
                }
                small={
                    <Drawer
                        variant="permanent"
                        open={open}
                        classes={{
                            paper: classnames(
                                classes.drawerPaper,
                                !open && classes.drawerPaperClose
                            ),
                        }}
                        onClose={this.toggleSidebar}
                        {...rest}
                    >
                        {React.cloneElement(children, {
                            dense: true,
                            onMenuClick: this.handleClose,
                            open
                        })}
                    </Drawer>
                }
                medium={
                    <Drawer
                        variant="permanent"
                        open={open}
                        classes={{
                            paper: classnames(
                                classes.drawerPaper,
                                !open && classes.drawerPaperClose
                            ),
                        }}
                        onClose={this.toggleSidebar}
                        {...rest}
                    >
                        {React.cloneElement(children, {
                            dense: true,
                            open
                        })}
                    </Drawer>
                }
            />
        );
    }
}

Sidebar.propTypes = {
    children: PropTypes.node.isRequired,
    classes: PropTypes.object,
    open: PropTypes.bool.isRequired,
    setSidebarVisibility: PropTypes.func.isRequired,
    width: PropTypes.string,
};

const mapStateToProps = state => ({
    open: state.admin.ui.sidebarOpen,
    locale: state.locale, // force redraw on locale change
});

export default compose(
    connect(
        mapStateToProps,
        { setSidebarVisibility }
    ),
    withStyles(styles),
    withWidth()
)(Sidebar);
