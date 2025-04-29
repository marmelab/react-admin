import * as React from 'react';
import type { ElementType, ReactElement } from 'react';
import {
    Card,
    type ComponentsOverrides,
    styled,
    type SxProps,
    type Theme,
    useThemeProps,
} from '@mui/material';
import { useCreateContext } from 'ra-core';
import clsx from 'clsx';

import { Title } from '../layout';

export const CreateView = (inProps: CreateViewProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const {
        actions,
        aside,
        children,
        className,
        component: Content = Card,
        title,
        ...rest
    } = props;

    const { resource, defaultTitle } = useCreateContext();

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
                <Content className={CreateClasses.card}>{children}</Content>
                {aside}
            </div>
        </Root>
    );
};

export interface CreateViewProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    actions?: ReactElement | false;
    aside?: ReactElement;
    component?: ElementType;
    sx?: SxProps<Theme>;
    title?: string | ReactElement | false;
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
        RaCreate: Partial<CreateViewProps>;
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
