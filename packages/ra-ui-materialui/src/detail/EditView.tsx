import * as React from 'react';
import { ReactElement, ElementType } from 'react';
import { Card, CardContent, styled, SxProps } from '@mui/material';
import clsx from 'clsx';
import { useEditContext, useResourceDefinition, useCanAccess } from 'ra-core';

import { EditActions } from './EditActions';
import { Title } from '../layout';
import { DefaultUnauthorizedView } from './DefaultUnauthorizedView';

export const EditView = (props: EditViewProps) => {
    const {
        actions,
        aside,
        children,
        className,
        component: Content = Card,
        title,
        unauthorized = <DefaultUnauthorizedView />,
        ...rest
    } = props;

    const { hasShow } = useResourceDefinition();
    const { resource, defaultTitle, record } = useEditContext();
    const { canAccess, isPending } = useCanAccess({
        resource,
        action: 'edit',
        record,
        enabled: !!record,
    });

    const finalActions =
        typeof actions === 'undefined' && hasShow ? defaultActions : actions;
    if (!children || isPending) {
        return null;
    }

    if (!canAccess) {
        return unauthorized;
    }

    return (
        <Root className={clsx('edit-page', className)} {...rest}>
            {title !== false && (
                <Title
                    title={title}
                    defaultTitle={defaultTitle}
                    preferenceKey={`${resource}.edit.title`}
                />
            )}
            {finalActions}
            <div
                className={clsx(EditClasses.main, {
                    [EditClasses.noActions]: !finalActions,
                })}
            >
                <Content className={EditClasses.card}>
                    {record ? children : <CardContent>&nbsp;</CardContent>}
                </Content>
                {aside}
            </div>
        </Root>
    );
};

export interface EditViewProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, 'id' | 'title'> {
    actions?: ReactElement | false;
    aside?: ReactElement;
    component?: ElementType;
    title?: string | ReactElement | false;
    sx?: SxProps;
    unauthorized?: ReactElement;
}

const defaultActions = <EditActions />;

const PREFIX = 'RaEdit';

export const EditClasses = {
    main: `${PREFIX}-main`,
    noActions: `${PREFIX}-noActions`,
    card: `${PREFIX}-card`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    [`& .${EditClasses.main}`]: {
        display: 'flex',
        alignItems: 'flex-start',
    },
    [`& .${EditClasses.noActions}`]: {
        marginTop: '1em',
    },
    [`& .${EditClasses.card}`]: {
        flex: '1 1 auto',
    },
});
