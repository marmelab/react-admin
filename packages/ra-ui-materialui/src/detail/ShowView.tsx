import * as React from 'react';
import type { ElementType, ReactNode } from 'react';
import {
    Card,
    type ComponentsOverrides,
    styled,
    type SxProps,
    type Theme,
} from '@mui/material';
import clsx from 'clsx';
import {
    useShowContext,
    useResourceDefinition,
    ShowControllerResult,
} from 'ra-core';
import { ShowActions } from './ShowActions';
import { Title } from '../layout';
import { ShowProps } from './Show';
import { Offline } from '../Offline';

const defaultActions = <ShowActions />;
const defaultOffline = <Offline />;

export const ShowView = (props: ShowViewProps) => {
    const {
        actions,
        aside,
        children,
        render,
        className,
        component: Content = Card,
        emptyWhileLoading = false,
        offline = defaultOffline,
        error,
        title,
        ...rest
    } = props;

    const showContext = useShowContext();
    const {
        resource,
        defaultTitle,
        isPaused,
        isPending,
        record,
        error: errorState,
    } = showContext;
    const { hasEdit } = useResourceDefinition();

    const finalActions =
        typeof actions === 'undefined' && hasEdit ? defaultActions : actions;

    const showOffline =
        isPaused && isPending && offline !== undefined && offline !== false;

    const showError = errorState && error !== false && error !== undefined;

    if (
        !record &&
        isPending &&
        emptyWhileLoading &&
        !showOffline &&
        !showError
    ) {
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
                <Content className={ShowClasses.card}>
                    {showOffline
                        ? offline
                        : showError
                          ? error
                          : render
                            ? render(showContext)
                            : children}
                </Content>
                {aside}
            </div>
        </Root>
    );
};

export interface ShowViewProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, 'id' | 'title'> {
    actions?: ReactNode | false;
    aside?: ReactNode;
    component?: ElementType;
    emptyWhileLoading?: boolean;
    offline?: ReactNode;
    error?: ReactNode;
    title?: ReactNode;
    sx?: SxProps<Theme>;
    render?: (showContext: ShowControllerResult) => ReactNode;
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
        RaShow: Partial<ShowProps>;
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
