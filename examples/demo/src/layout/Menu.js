import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import SettingsIcon from '@material-ui/icons/Settings';
import LabelIcon from '@material-ui/icons/Label';
import { withRouter } from 'react-router-dom';
import { translate, DashboardMenuItem, MenuItemLink, Responsive } from 'react-admin';

import visitors from '../visitors';
import orders from '../orders';
import invoices from '../invoices';
import products from '../products';
import categories from '../categories';
import reviews from '../reviews';
import SubMenu from './SubMenu';

class Menu extends Component {
    state = {
        menuCatalog: false,
        menuSales: false,
        menuCustomers: false,
    };

    static propTypes = {
        onMenuClick: PropTypes.func,
        logout: PropTypes.object,
    };

    handleToggle = menu => {
        this.setState(state => ({ [menu]: !state[menu] }));
    };

    render() {
        const { onMenuClick, open, logout, translate } = this.props;
        return (
            <div>
                {' '}
                <DashboardMenuItem onClick={onMenuClick} />
                <SubMenu
                    handleToggle={() => this.handleToggle('menuSales')}
                    isOpen={this.state.menuSales}
                    sidebarIsOpen={open}
                    name="pos.menu.sales"
                    icon={<orders.icon />}
                >
                    <MenuItemLink
                        to={`/commands`}
                        primaryText={translate(`resources.commands.name`, {
                            smart_count: 2,
                        })}
                        leftIcon={<orders.icon />}
                        onClick={onMenuClick}
                    />
                    <MenuItemLink
                        to={`/invoices`}
                        primaryText={translate(`resources.invoices.name`, {
                            smart_count: 2,
                        })}
                        leftIcon={<invoices.icon />}
                        onClick={onMenuClick}
                    />
                </SubMenu>
                <SubMenu
                    handleToggle={() => this.handleToggle('menuCatalog')}
                    isOpen={this.state.menuCatalog}
                    sidebarIsOpen={open}
                    name="pos.menu.catalog"
                    icon={<products.icon />}
                >
                    <MenuItemLink
                        to={`/products`}
                        primaryText={translate(`resources.products.name`, {
                            smart_count: 2,
                        })}
                        leftIcon={<products.icon />}
                        onClick={onMenuClick}
                    />
                    <MenuItemLink
                        to={`/categories`}
                        primaryText={translate(`resources.categories.name`, {
                            smart_count: 2,
                        })}
                        leftIcon={<categories.icon />}
                        onClick={onMenuClick}
                    />
                </SubMenu>
                <SubMenu
                    handleToggle={() => this.handleToggle('menuCustomer')}
                    isOpen={this.state.menuCustomer}
                    sidebarIsOpen={open}
                    name="pos.menu.customers"
                    icon={<visitors.icon />}
                >
                    <MenuItemLink
                        to={`/customers`}
                        primaryText={translate(`resources.customers.name`, {
                            smart_count: 2,
                        })}
                        leftIcon={<visitors.icon />}
                        onClick={onMenuClick}
                    />
                    <MenuItemLink
                        to={`/segments`}
                        primaryText={translate(`resources.segments.name`, {
                            smart_count: 2,
                        })}
                        leftIcon={<LabelIcon />}
                        onClick={onMenuClick}
                    />
                </SubMenu>
                <MenuItemLink
                    to={`/reviews`}
                    primaryText={translate(`resources.reviews.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<reviews.icon />}
                    onClick={onMenuClick}
                />
                <Responsive
                    xsmall={
                        <MenuItemLink
                            to="/configuration"
                            primaryText={translate('pos.configuration')}
                            leftIcon={<SettingsIcon />}
                            onClick={onMenuClick}
                        />
                    }
                    medium={null}
                />
                <Responsive
                    small={logout}
                    medium={null} // Pass null to render nothing on larger devices
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    open: state.admin.ui.sidebarOpen,
    theme: state.theme,
    locale: state.i18n.locale,
});

const enhance = compose(
    withRouter,
    connect(
        mapStateToProps,
        {}
    ),
    translate
);

export default enhance(Menu);
