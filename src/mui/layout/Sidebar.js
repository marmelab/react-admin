import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import muiThemeable from 'material-ui/styles/muiThemeable';
import compose from 'recompose/compose';
import Responsive from './Responsive';
import translate from '../../i18n/translate';
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

class Sidebar extends Component {
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

const mapStateToProps = state => ({
    open: state.admin.ui.sidebarOpen,
    locale: state.locale, // force redraw on locale change
});

const enhanced = compose(
    muiThemeable(), // force redraw on theme change
    connect(mapStateToProps, {
        setSidebarVisibility: setSidebarVisibilityAction,
    }),
    translate,
);

export default enhanced(Sidebar);
