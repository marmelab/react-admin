import * as React from 'react';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import { Toolbar, ToolbarProps } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Exporter } from 'ra-core';

import { ClassesOverride } from '../types';
import { FilterForm } from './filter';
import { FilterContext } from './FilterContext';

const useStyles = makeStyles(
    theme => ({
        toolbar: {
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingRight: 0,
            [theme.breakpoints.up('xs')]: {
                paddingLeft: 0,
            },
            [theme.breakpoints.down('xs')]: {
                paddingLeft: theme.spacing(2),
                backgroundColor: theme.palette.background.paper,
            },
        },
        actions: {
            paddingTop: theme.spacing(3),
            minHeight: theme.spacing(5),
            [theme.breakpoints.down('xs')]: {
                padding: theme.spacing(1),
                backgroundColor: theme.palette.background.paper,
            },
        },
    }),
    { name: 'RaListToolbar' }
);

const ListToolbar = (props: ListToolbarProps) => {
    const { classes: classesOverride, filters, actions, ...rest } = props;
    const classes = useStyles(props);

    return Array.isArray(filters) ? (
        <FilterContext.Provider value={filters}>
            <Toolbar className={classes.toolbar}>
                <FilterForm />
                <span />
                {actions &&
                    React.cloneElement(actions, {
                        ...rest,
                        className: classes.actions,
                        ...actions.props,
                    })}
            </Toolbar>
        </FilterContext.Provider>
    ) : (
        <Toolbar className={classes.toolbar}>
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
        </Toolbar>
    );
};

ListToolbar.propTypes = {
    classes: PropTypes.object,
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
    classes?: ClassesOverride<typeof useStyles>;
    filters?: ReactElement | ReactElement[];
    exporter?: Exporter | false;
}

export default React.memo(ListToolbar);
