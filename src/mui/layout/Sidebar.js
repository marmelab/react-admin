import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import Drawer from 'material-ui/Drawer';
import Paper from 'material-ui/Paper';
import Responsive from './Responsive';
import { setSidebarVisibility as setSidebarVisibilityAction } from '../../actions';

const styles = {
    sidebarOpen: {
        flex: '0 0 16em',
        marginLeft: 0,
        order: -1,
        transition: 'margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    },
    sidebarClosed: {
        flex: '0 0 16em',
        marginLeft: '-16em',
        order: -1,
        transition: 'margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    },
};

// We shouldn't need PureComponent here as it's connected
// but for some reason it keeps rendering even though mapStateToProps returns the same object
class Sidebar extends PureComponent {
    handleClose = () => {
        this.props.setSidebarVisibility(false);
    }

    render() {
        const { open, setSidebarVisibility, children } = this.props;
        return (
            <Responsive
                small={
                    <Drawer docked={false} open={open} onRequestChange={setSidebarVisibility}>
                        {React.cloneElement(children, { onMenuTap: this.handleClose })}
                    </Drawer>
                }
                medium={
                    <Paper style={open ? styles.sidebarOpen : styles.sidebarClosed}>
                        {children}
                    </Paper>
                }
            />
        )
    }
}

Sidebar.propTypes = {
    setSidebarVisibility: PropTypes.func.isRequired,
    open: PropTypes.bool,
};

const mapStateToProps = (state, props) => ({
    open: state.admin.ui.sidebarOpen,
    locale: state.locale, // force redraw on locale change
    theme: props.theme, // force redraw on theme changes
});

export default connect(mapStateToProps, {
    setSidebarVisibility: setSidebarVisibilityAction,
})(Sidebar);
