import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactNode, FC } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import lodashGet from 'lodash/get';
import classnames from 'classnames';
import { ReduxState } from 'ra-core';

import { DashboardMenuItem } from 'react-admin';
import { NewResourceMenuItem } from './NewResourceMenuItem';
import { useResourcesConfiguration } from '../ResourceConfiguration';
import { ResourceMenuItem } from './ResourceMenuItem';

const PREFIX = 'RaMenu';

const classes = {
    main: `${PREFIX}-main`,
    open: `${PREFIX}-open`,
    closed: `${PREFIX}-closed`,
};

const Root = styled('div')(({ theme }) => ({
    [`& .${classes.main}`]: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginTop: '0.5em',
        [theme.breakpoints.only('xs')]: {
            marginTop: 0,
        },
        [theme.breakpoints.up('md')]: {
            marginTop: '1.5em',
        },
    },

    [`& .${classes.open}`]: {
        width: lodashGet(theme, 'menu.width', MENU_WIDTH),
    },

    [`& .${classes.closed}`]: {
        width: lodashGet(theme, 'menu.closedWidth', CLOSED_MENU_WIDTH),
    },
}));

export const MENU_WIDTH = 240;
export const CLOSED_MENU_WIDTH = 55;

export const Menu: FC<MenuProps> = (props: MenuProps) => {
    const { className, dense, hasDashboard, ...rest } = props;
    const open = useSelector((state: ReduxState) => state.admin.ui.sidebarOpen);
    const [resources] = useResourcesConfiguration();

    return (
        <Root>
            <div
                className={classnames(
                    classes.main,
                    {
                        [classes.open]: open,
                        [classes.closed]: !open,
                    },
                    className
                )}
                {...rest}
            >
                {hasDashboard && (
                    <DashboardMenuItem dense={dense} sidebarIsOpen={open} />
                )}
                {Object.keys(resources).map(resource => (
                    <ResourceMenuItem
                        key={resource}
                        resource={resources[resource]}
                        dense={dense}
                        sidebarIsOpen={open}
                    />
                ))}
                <NewResourceMenuItem dense={dense} sidebarIsOpen={open} />
            </div>
        </Root>
    );
};

export interface MenuProps {
    classes?: object;
    className?: string;
    dense?: boolean;
    hasDashboard?: boolean;
    logout?: ReactNode;
    onMenuClick?: () => void;
}

Menu.propTypes = {
    className: PropTypes.string,
    dense: PropTypes.bool,
    hasDashboard: PropTypes.bool,
    logout: PropTypes.element,
    onMenuClick: PropTypes.func,
};

Menu.defaultProps = {
    onMenuClick: () => null,
};
