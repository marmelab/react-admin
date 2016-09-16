import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';
import Notification from './Notification';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Menu from './Menu';

injectTapEventPlugin();

class Layout extends Component {

    constructor(props) {
        super(props);

        this.state = {
            menu: {
                open: false,
                selectedItem: 0,
            },
        };
    }

    toggleMenu = () => {
        const open = this.state.menu.open;
        this.setState({
            menu: {
                ...this.state.menu,
                open: !open,
            },
        });
    };

    handleMenuRequestChange = (open) => {
        this.setState({
            menu: {
                ...this.state.menu,
                open,
            },
        });
    };

    handleMenuSelectionChange = (e, index) => {
        this.setState({
            menu: {
                open: false,
                selectedItem: index,
            },
        });
    };

    render() {
        const { isLoading, children, route, title } = this.props;
        const { menu: { open, selectedItem } } = this.state;
        const Title = <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>{title}</Link>;
        const RightElement = isLoading ? <CircularProgress color="#fff" size={0.5} /> : <span />;

        return (
            <MuiThemeProvider>
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <AppBar title={Title} iconElementRight={RightElement} onLeftIconButtonTouchTap={this.toggleMenu} />
                    <div className="body" style={{ flex: '1', backgroundColor: '#edecec' }}>
                        <div>{children}</div>
                        <Menu resources={route.resources} open={open} selectedItem={selectedItem} handleSelectionChange={this.handleMenuSelectionChange} handleRequestChange={this.handleMenuRequestChange} />
                    </div>
                    <Notification />
                </div>
            </MuiThemeProvider>
        );
    }
}

Layout.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    children: PropTypes.node,
    route: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
    return { isLoading: state.admin.loading > 0 };
}

export default connect(
  mapStateToProps,
)(Layout);
