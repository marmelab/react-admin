import * as React from 'react';
import { ReactElement, ElementType } from 'react';
import { Card, styled, SxProps } from '@mui/material';
import clsx from 'clsx';
import { useShowContext, useResourceDefinition } from 'ra-core';
import { ShowActions } from './ShowActions';
import { Title } from '../layout';

const defaultActions = <ShowActions />;

export const ShowView = (props: ShowViewProps) => {
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
    sx?: SxProps;
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
