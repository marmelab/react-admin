import React, { PureComponent, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Drawer from '@material-ui/core/Drawer';
import { withStyles, createStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import { setSidebarVisibility } from 'ra-core';
import lodashGet from 'lodash/get';
import Responsive from './Responsive';

export const DRAWER_WIDTH = 240;
export const CLOSED_DRAWER_WIDTH = 55;

const styles = theme =>
    createStyles({
        drawerPaper: {
            position: 'relative',
            height: 'auto',
            overflowX: 'hidden',
            width: props => props.open
                ? lodashGet(theme, 'sidebar.width', DRAWER_WIDTH)
                : lodashGet(theme, 'sidebar.closedWidth', CLOSED_DRAWER_WIDTH),
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            backgroundColor: 'transparent',
            marginTop: '0.5em',
            borderRight: 'none',
            [theme.breakpoints.only('xs')]: {
                marginTop: 0,
                height: '100vh',
                position: 'inherit',
                backgroundColor: theme.palette.background.default,
            },
            [theme.breakpoints.up('md')]: {
                border: 'none',
                marginTop: '1.5em',
            },
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
                        PaperProps={{
                            className: classes.drawerPaper,
                        }}
                        onClose={this.toggleSidebar}
                        {...rest}
                    >
                        {cloneElement(Children.only(children), {
                            onMenuClick: this.handleClose,
                        })}
                    </Drawer>
                }
                small={
                    <Drawer
                        variant="permanent"
                        open={open}
                        PaperProps={{
                            className: classes.drawerPaper,
                        }}
                        onClose={this.toggleSidebar}
                        {...rest}
                    >
                        {cloneElement(Children.only(children), {
                            dense: true,
                            onMenuClick: this.handleClose,
                        })}
                    </Drawer>
                }
                medium={
                    <Drawer
                        variant="permanent"
                        open={open}
                        PaperProps={{
                            className: classes.drawerPaper,
                        }}
                        onClose={this.toggleSidebar}
                        {...rest}
                    >
                        {cloneElement(Children.only(children), { dense: true })}
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
    withWidth({ resizeInterval: Infinity }) // used to initialize the visibility on first render
)(Sidebar);
