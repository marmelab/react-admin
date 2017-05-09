import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Drawer from 'material-ui/Drawer';
import Paper from 'material-ui/Paper';
import Responsive from './Responsive';
import { setSidebarVisibility as setSidebarVisibilityAction } from '../../actions';


export function getStyles(props, context) {
  const {
    sideBar,
  } = context.muiTheme;  
  const styles = {
    sidebarOpen: {
        flex: !(sideBar && sideBar.width) ? '0 0 16em' : `0 0 ${sideBar.width}`,
        marginLeft: 0,
        order: -1,
        transition: 'margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    },
    sidebarClosed: {
        flex: !(sideBar && sideBar.width) ? '0 0 16em' : `0 0 ${sideBar.width}`,
        marginLeft: !(sideBar && sideBar.width) ? '-16em' : `-${sideBar.width}`,
        order: -1,
        transition: 'margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    },
  };

  return styles;
}

// We shouldn't need PureComponent here as it's connected
// but for some reason it keeps rendering even though mapStateToProps returns the same object
class Sidebar extends PureComponent {

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
    };

    handleClose = () => {
        this.props.setSidebarVisibility(false);
    }

    render() {        
        const styles = getStyles(this.props, this.context);    
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
