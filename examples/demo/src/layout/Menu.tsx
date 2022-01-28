import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import LabelIcon from '@mui/icons-material/Label';
import classnames from 'classnames';
import {
    useTranslate,
    DashboardMenuItem,
    MenuItemLink,
    MenuProps,
    useSidebarState,
} from 'react-admin';

import visitors from '../visitors';
import orders from '../orders';
import invoices from '../invoices';
import products from '../products';
import categories from '../categories';
import reviews from '../reviews';
import SubMenu from './SubMenu';

const PREFIX = 'Menu';

const classes = {
    root: `${PREFIX}-root`,
    open: `${PREFIX}-open`,
    closed: `${PREFIX}-closed`,
};

const Root = styled('div')(({ theme }) => ({
    [`&.${classes.root}`]: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },

    [`&.${classes.open}`]: {
        width: 200,
    },

    [`&.${classes.closed}`]: {
        width: 50,
    },
}));

type MenuName = 'menuCatalog' | 'menuSales' | 'menuCustomers';

const Menu = ({ dense = false }: MenuProps) => {
    const [state, setState] = useState({
        menuCatalog: true,
        menuSales: true,
        menuCustomers: true,
    });
    const translate = useTranslate();
    const open = useSidebarState();

    const handleToggle = (menu: MenuName) => {
        setState(state => ({ ...state, [menu]: !state[menu] }));
    };

    return (
        <Root
            className={classnames(classes.root, {
                [classes.open]: open,
                [classes.closed]: !open,
            })}
        >
            {' '}
            <DashboardMenuItem />
            <SubMenu
                handleToggle={() => handleToggle('menuSales')}
                isOpen={state.menuSales}
                name="pos.menu.sales"
                icon={<orders.icon />}
                dense={dense}
            >
                <MenuItemLink
                    to="/commands"
                    state={{ _scrollToTop: true }}
                    primaryText={translate(`resources.commands.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<orders.icon />}
                    dense={dense}
                />
                <MenuItemLink
                    to="/invoices"
                    state={{ _scrollToTop: true }}
                    primaryText={translate(`resources.invoices.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<invoices.icon />}
                    dense={dense}
                />
            </SubMenu>
            <SubMenu
                handleToggle={() => handleToggle('menuCatalog')}
                isOpen={state.menuCatalog}
                name="pos.menu.catalog"
                icon={<products.icon />}
                dense={dense}
            >
                <MenuItemLink
                    to="/products"
                    state={{ _scrollToTop: true }}
                    primaryText={translate(`resources.products.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<products.icon />}
                    dense={dense}
                />
                <MenuItemLink
                    to="/categories"
                    state={{ _scrollToTop: true }}
                    primaryText={translate(`resources.categories.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<categories.icon />}
                    dense={dense}
                />
            </SubMenu>
            <SubMenu
                handleToggle={() => handleToggle('menuCustomers')}
                isOpen={state.menuCustomers}
                name="pos.menu.customers"
                icon={<visitors.icon />}
                dense={dense}
            >
                <MenuItemLink
                    to="/customers"
                    state={{ _scrollToTop: true }}
                    primaryText={translate(`resources.customers.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<visitors.icon />}
                    dense={dense}
                />
                <MenuItemLink
                    to="/segments"
                    state={{ _scrollToTop: true }}
                    primaryText={translate(`resources.segments.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<LabelIcon />}
                    dense={dense}
                />
            </SubMenu>
            <MenuItemLink
                to="/reviews"
                state={{ _scrollToTop: true }}
                primaryText={translate(`resources.reviews.name`, {
                    smart_count: 2,
                })}
                leftIcon={<reviews.icon />}
                dense={dense}
            />
        </Root>
    );
};

export default Menu;
