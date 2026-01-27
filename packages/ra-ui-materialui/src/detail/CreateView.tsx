import * as React from 'react';
import type { ElementType, ReactNode } from 'react';
import {
    Card,
    type ComponentsOverrides,
    styled,
    type SxProps,
    type Theme,
} from '@mui/material';
import { CreateControllerResult, useCreateContext } from 'ra-core';
import clsx from 'clsx';

import { Title } from '../layout';
import { CreateProps } from './Create';

export const CreateView = (props: CreateViewProps) => {
    const {
        actions,
        aside,
        children,
        render,
        className,
        component: Content = Card,
        title,
        ...rest
    } = props;

    const createContext = useCreateContext();

    const { resource, defaultTitle } = createContext;

    return (
        <Root className={clsx('create-page', className)} {...rest}>
            {title !== false && (
                <Title
                    title={title}
                    defaultTitle={defaultTitle}
                    preferenceKey={`${resource}.create.title`}
                />
            )}
            {actions}
            <div
                className={clsx(CreateClasses.main, {
                    [CreateClasses.noActions]: !actions,
                })}
            >
                <Content className={CreateClasses.card}>
                    {render ? render(createContext) : children}
                </Content>
                {aside}
            </div>
        </Root>
    );
};

export interface CreateViewProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    actions?: ReactNode | false;
    aside?: ReactNode;
    component?: ElementType;
    sx?: SxProps<Theme>;
    title?: ReactNode;
    render?: (createContext: CreateControllerResult) => ReactNode;
    children?: ReactNode;
}

const PREFIX = 'RaCreate';

export const CreateClasses = {
    main: `${PREFIX}-main`,
    noActions: `${PREFIX}-noActions`,
    card: `${PREFIX}-card`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${CreateClasses.main}`]: {
        display: 'flex',
    },

    [`& .${CreateClasses.noActions}`]: {
        [theme.breakpoints.up('sm')]: {
            marginTop: '1em',
        },
    },

    [`& .${CreateClasses.card}`]: {
        flex: '1 1 auto',
    },
}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaCreate: 'root' | 'main' | 'noActions' | 'card';
    }

    interface ComponentsPropsList {
        RaCreate: Partial<CreateProps>;
    }

    interface Components {
        RaCreate?: {
            defaultProps?: ComponentsPropsList['RaCreate'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaCreate'];
        };
    }
}
