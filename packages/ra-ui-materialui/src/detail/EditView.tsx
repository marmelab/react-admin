import * as React from 'react';
import { ReactElement, ElementType } from 'react';
import { Box, Button, Card, CardContent, styled, SxProps } from '@mui/material';
import clsx from 'clsx';
import {
    useEditContext,
    useResourceDefinition,
    useCanAccess,
    useTranslate,
} from 'ra-core';
import LockIcon from '@mui/icons-material/Lock';

import { EditActions } from './EditActions';
import { Title } from '../layout';
import { History } from '@mui/icons-material';

const defaultActions = <EditActions />;

function goBack() {
    window.history.go(-1);
}

const DefaultUnauthorizedView = () => {
    const translate = useTranslate();
    return (
        <Box
            sx={theme => ({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                [theme.breakpoints.down('md')]: {
                    padding: '1em',
                },
                fontFamily: 'Roboto, sans-serif',
                opacity: 0.5,
                '& h1': {
                    display: 'flex',
                    alignItems: 'center',
                },
            })}
        >
            <h1 role="alert">
                <LockIcon
                    sx={{
                        width: '2em',
                        height: '2em',
                        marginRight: '0.5em',
                    }}
                />
                {translate('ra-rbac.page.unauthorized')}
            </h1>
            <div>{translate('ra-rbac.message.unauthorized')}</div>
            <Box
                sx={{
                    marginTop: '2em',
                }}
            >
                <Button
                    variant="contained"
                    startIcon={<History />}
                    onClick={goBack}
                >
                    {translate('ra.action.back')}
                </Button>
            </Box>
        </Box>
    );
};

export const EditView = (props: EditViewProps) => {
    const {
        actions,
        aside,
        children,
        className,
        component: Content = Card,
        title,
        unauthorizedView = <DefaultUnauthorizedView />,
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
        return unauthorizedView;
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
    unauthorizedView?: ReactElement;
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
