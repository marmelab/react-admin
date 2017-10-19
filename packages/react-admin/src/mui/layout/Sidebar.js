import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Drawer from 'material-ui/Drawer';
import Hidden from 'material-ui/Hidden';

import { setSidebarVisibility as setSidebarVisibilityAction } from '../../actions';

// We shouldn't need PureComponent here as it's connected
// but for some reason it keeps rendering even though mapStateToProps returns the same object
class Sidebar extends PureComponent {
    handleClose = () => {
        this.props.setSidebarVisibility(false);
    };

    render() {
        const { open, setSidebarVisibility, children } = this.props;

        return [
            <Hidden mdUp key="desktop">
                <Drawer type="temporary" open={open}>
                    {React.cloneElement(children, {
                        onMenuTap: () => null,
                    })}
                </Drawer>
            </Hidden>,
            <Hidden mdDown key="mobile">
                <Drawer
                    type="permanent"
                    open={open}
                    onRequestClose={setSidebarVisibility}
                >
                    {React.cloneElement(children, {
                        onMenuTap: this.handleClose,
                    })}
                </Drawer>
            </Hidden>,
        ];
    }
}

Sidebar.propTypes = {
    children: PropTypes.node.isRequired,
    open: PropTypes.bool.isRequired,
    setSidebarVisibility: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    open: state.admin.ui.sidebarOpen,
    locale: state.locale, // force redraw on locale change
});

export default compose(
    connect(mapStateToProps, {
        setSidebarVisibility: setSidebarVisibilityAction,
    })
)(Sidebar);
