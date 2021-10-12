import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import { Toolbar, ToolbarProps } from '@mui/material';
import { Exporter } from 'ra-core';

import { FilterForm } from './filter';
import { FilterContext } from './FilterContext';

const PREFIX = 'RaListToolbar';

const classes = {
    toolbar: `${PREFIX}-toolbar`,
    actions: `${PREFIX}-actions`,
};

const Root = styled(Toolbar)(({ theme }) => ({
    [`&.${classes.toolbar}`]: {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingRight: 0,
        [theme.breakpoints.up('xs')]: {
            paddingLeft: 0,
        },
        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(2),
            backgroundColor: theme.palette.background.paper,
        },
    },

    [`& .${classes.actions}`]: {
        paddingTop: theme.spacing(3),
        minHeight: theme.spacing(5),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1),
            backgroundColor: theme.palette.background.paper,
        },
    },
}));

const ListToolbar = (props: ListToolbarProps) => {
    const { filters, actions, ...rest } = props;

    return Array.isArray(filters) ? (
        <FilterContext.Provider value={filters}>
            <Root className={classes.toolbar}>
                <FilterForm />
                <span />
                {actions &&
                    React.cloneElement(actions, {
                        ...rest,
                        className: classes.actions,
                        ...actions.props,
                    })}
            </Root>
        </FilterContext.Provider>
    ) : (
        <Root className={classes.toolbar}>
            {filters &&
                React.cloneElement(filters, {
                    ...rest,
                    context: 'form',
                })}
            <span />
            {actions &&
                React.cloneElement(actions, {
                    ...rest,
                    className: classes.actions,
                    filters,
                    ...actions.props,
                })}
        </Root>
    );
};

ListToolbar.propTypes = {
    filters: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element),
    ]),
    // @ts-ignore
    actions: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
    // @ts-ignore
    exporter: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
};

export interface ListToolbarProps
    extends Omit<ToolbarProps, 'classes' | 'onSelect'> {
    actions?: ReactElement | false;
    filters?: ReactElement | ReactElement[];
    exporter?: Exporter | false;
}

export default React.memo(ListToolbar);
