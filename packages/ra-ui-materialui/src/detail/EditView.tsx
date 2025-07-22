import * as React from 'react';
import type { ReactElement, ElementType, ReactNode } from 'react';
import {
    Card,
    CardContent,
    type ComponentsOverrides,
    styled,
    type SxProps,
    type Theme,
} from '@mui/material';
import clsx from 'clsx';
import {
    EditControllerResult,
    useEditContext,
    useResourceDefinition,
} from 'ra-core';

import { EditActions } from './EditActions';
import { Title } from '../layout';
import { EditProps } from './Edit';

const defaultActions = <EditActions />;

export const EditView = (props: EditViewProps) => {
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

    const { hasShow } = useResourceDefinition();
    const editContext = useEditContext();

    const { resource, defaultTitle, record, isPending } = editContext;

    const finalActions =
        typeof actions === 'undefined' && hasShow ? defaultActions : actions;

    if (!record && isPending && emptyWhileLoading) {
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
                    {render ? (
                        render(editContext)
                    ) : record ? (
                        children
                    ) : (
                        <CardContent>&nbsp;</CardContent>
                    )}
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
    emptyWhileLoading?: boolean;
    title?: string | ReactElement | false;
    sx?: SxProps<Theme>;
    render?: (editContext: EditControllerResult) => ReactNode;
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
