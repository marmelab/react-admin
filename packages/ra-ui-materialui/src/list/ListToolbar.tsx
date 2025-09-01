import * as React from 'react';
import { type FC, memo, type ReactElement } from 'react';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import type { ToolbarProps } from '@mui/material';
import { type Exporter, FilterContext } from 'ra-core';

import { FilterForm } from './filter';

export const ListToolbar: FC<ListToolbarProps> = memo(inProps => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const { filters, actions, className, ...rest } = props;

    return Array.isArray(filters) ? (
        <FilterContext.Provider value={filters}>
            <Root className={className}>
                <FilterForm />
                <span />
                {actions}
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
        backgroundColor: (theme.vars || theme).palette.background.paper,
        flexWrap: 'inherit',
        flexDirection: 'column-reverse',
    },
}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaListToolbar: 'root';
    }

    interface ComponentsPropsList {
        RaListToolbar: Partial<ListToolbarProps>;
    }

    interface Components {
        RaListToolbar?: {
            defaultProps?: ComponentsPropsList['RaListToolbar'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaListToolbar'];
        };
    }
}
