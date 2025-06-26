import * as React from 'react';
import type { ReactNode, ElementType } from 'react';
import {
    Card,
    CardContent,
    type ComponentsOverrides,
    styled,
    type SxProps,
    type Theme,
} from '@mui/material';
import clsx from 'clsx';
import { useEditContext, useResourceDefinition } from 'ra-core';

import { EditActions } from './EditActions';
import { Title } from '../layout';
import { Offline } from '../Offline';
import { EditProps } from './Edit';

const defaultActions = <EditActions />;
const defaultOffline = <Offline />;

export const EditView = (props: EditViewProps) => {
    const {
        actions,
        aside,
        children,
        className,
        component: Content = Card,
        offline = defaultOffline,
        emptyWhileLoading = false,
        title,
        ...rest
    } = props;

    const { hasShow } = useResourceDefinition();
    const { resource, defaultTitle, record, isPending, isPaused } =
        useEditContext();

    if (isPaused && record == null && offline) {
        return (
            <Root className={clsx('edit-page', className)} {...rest}>
                <div className={clsx(EditClasses.main, EditClasses.noActions)}>
                    <Content className={EditClasses.card}>{offline}</Content>
                </div>
            </Root>
        );
    }

    const finalActions =
        typeof actions === 'undefined' && hasShow ? defaultActions : actions;
    if (!children || (!record && isPending && emptyWhileLoading)) {
        return null;
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
    actions?: ReactNode;
    aside?: ReactNode;
    offline?: ReactNode;
    component?: ElementType;
    emptyWhileLoading?: boolean;
    title?: ReactNode;
    sx?: SxProps<Theme>;
}

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

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaEdit: 'root' | 'main' | 'noActions' | 'card';
    }

    interface ComponentsPropsList {
        RaEdit: Partial<EditProps>;
    }

    interface Components {
        RaEdit?: {
            defaultProps?: ComponentsPropsList['RaEdit'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaEdit'];
        };
    }
}
