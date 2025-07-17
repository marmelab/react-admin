import * as React from 'react';
import type { ReactElement, ElementType, ReactNode } from 'react';
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

const defaultActions = <ShowActions />;

export const ShowView = (props: ShowViewProps) => {
    const {
        actions,
        aside,
        children,
        render,
        className,
        component: Content = Card,
        emptyWhileLoading = false,
        title,
        ...rest
    } = props;

    const showContext = useShowContext();
    const { resource, defaultTitle, record } = showContext;
    const { hasEdit } = useResourceDefinition();

    const finalActions =
        typeof actions === 'undefined' && hasEdit ? defaultActions : actions;

    if (!record && emptyWhileLoading) {
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
                    {render ? render(showContext) : children}
                </Content>
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
