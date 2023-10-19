import * as React from 'react';
import { FC, memo } from 'react';
import { styled } from '@mui/material/styles';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import { ToolbarProps } from '@mui/material';
import { Exporter } from 'ra-core';

import { FilterForm } from './filter';
import { FilterContext } from './FilterContext';

export const ListToolbar: FC<ListToolbarProps> = memo(props => {
    const { filters, actions, className, ...rest } = props;

    return Array.isArray(filters) ? (
        <FilterContext.Provider value={filters}>
            <Root className={className}>
                <FilterForm />
                <span />
                {actions &&
                    React.cloneElement(actions, {
                        ...rest,
                        ...actions.props,
                    })}
            </Root>
        </FilterContext.Provider>
    ) : (
        <Root className={className}>
            {filters &&
                React.cloneElement(filters, {
                    ...rest,
                    context: 'form',
                })}
            <span />
            {actions &&
                React.cloneElement(actions, {
                    ...rest,
                    filters,
                    ...actions.props,
                })}
        </Root>
    );
});

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
    exporter?: Exporter | false;
    filters?: ReactElement | ReactElement[];
    hasCreate?: boolean;
}

const PREFIX = 'RaListToolbar';

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    display: 'flex',
    position: 'relative',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    [theme.breakpoints.down('md')]: {
        flexWrap: 'wrap',
    },
    [theme.breakpoints.down('sm')]: {
        backgroundColor: theme.palette.background.paper,
        flexWrap: 'inherit',
        flexDirection: 'column-reverse',
    },
}));
