import * as React from 'react';
import type { ReactElement, ElementType } from 'react';
import {
    Card,
    type ComponentsOverrides,
    styled,
    type SxProps,
    type Theme,
    useThemeProps,
} from '@mui/material';
import clsx from 'clsx';
import { useShowContext, useResourceDefinition } from 'ra-core';
import { ShowActions } from './ShowActions';
import { Title } from '../layout';

const defaultActions = <ShowActions />;

export const ShowView = (inProps: ShowViewProps) => {
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
        emptyWhileLoading = false,
        title,
        ...rest
    } = props;

    const { resource, defaultTitle, record } = useShowContext();
    const { hasEdit } = useResourceDefinition();

    const finalActions =
        typeof actions === 'undefined' && hasEdit ? defaultActions : actions;

    if (!children || (!record && emptyWhileLoading)) {
        return null;
    }
    return (
        <Root className={clsx('show-page', className)} {...rest}>
            {title !== false && (
                <Title
                    title={title}
                    defaultTitle={defaultTitle}
                    preferenceKey={`${resource}.show.title`}
                />
            )}
            {finalActions !== false && finalActions}
            <div
                className={clsx(ShowClasses.main, {
                    [ShowClasses.noActions]: !finalActions,
                })}
            >
                <Content className={ShowClasses.card}>{children}</Content>
                {aside}
            </div>
        </Root>
    );
};

export interface ShowViewProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, 'id' | 'title'> {
    actions?: ReactElement | false;
    aside?: ReactElement;
    component?: ElementType;
    emptyWhileLoading?: boolean;
    title?: string | ReactElement | false;
    sx?: SxProps<Theme>;
}

const PREFIX = 'RaShow';

export const ShowClasses = {
    main: `${PREFIX}-main`,
    noActions: `${PREFIX}-noActions`,
    card: `${PREFIX}-card`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    [`& .${ShowClasses.main}`]: {
        display: 'flex',
    },
    [`& .${ShowClasses.noActions}`]: {
        marginTop: '1em',
    },
    [`& .${ShowClasses.card}`]: {
        flex: '1 1 auto',
    },
});

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaShow: 'root' | 'main' | 'noActions' | 'card';
    }

    interface ComponentsPropsList {
        RaShow: Partial<ShowViewProps>;
    }

    interface Components {
        RaShow?: {
            defaultProps?: ComponentsPropsList['RaShow'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaShow'];
        };
    }
}
