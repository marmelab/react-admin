import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';
import withWidth from 'material-ui/utils/withWidth';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import IconButton from 'material-ui/IconButton';

import Responsive from './Responsive';
import { setSidebarVisibility } from 'ra-core';

export const DRAWER_WIDTH = 240;

const styles = theme => ({
    drawerPaper: {
        height: '100%',
        width: DRAWER_WIDTH,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
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
            ...rest
        } = this.props;

        return (
            <Responsive
                small={
                    <Drawer
                        variant="temporary"
                        open={open}
                        onClose={this.toggleSidebar}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        {...rest}
                    >
                        {React.cloneElement(children, {
                            onMenuClick: this.handleClose,
                        })}
                    </Drawer>
                }
                medium={
                    <Drawer
                        variant="persistent"
                        open={open}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        onClose={this.toggleSidebar}
                        {...rest}
                    >
                        <div className={classes.drawerHeader}>
                            <IconButton onClick={this.toggleSidebar}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </div>
                        <Divider />
                        {children}
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
    connect(mapStateToProps, { setSidebarVisibility }),
    withStyles(styles),
    withWidth()
)(Sidebar);
