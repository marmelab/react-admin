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
import { setSidebarVisibility } from '../../actions';

export const DRAWER_WIDTH = 240;

const styles = theme => ({
    drawerPaper: {
        height: '100%',
        width: DRAWER_WIDTH,
        backgroundColor: theme.palette.background.default,
        paddingTop: '5em',
        [theme.breakpoints.up('md')]: {
            border: 'none',
        },
        [theme.breakpoints.down('xs')]: {
            paddingTop: 0,
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
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        onClose={this.toggleSidebar}
                        {...rest}
                    >
                        {React.cloneElement(children, {
                            onMenuClick: this.handleClose,
                        })}
                    </Drawer>
                }
                small={
                    <Drawer
                        variant="persistent"
                        open={open}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        onClose={this.toggleSidebar}
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
