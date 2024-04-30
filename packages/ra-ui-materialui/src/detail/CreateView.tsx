import * as React from 'react';
import { ElementType, ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Card, styled, SxProps } from '@mui/material';
import { useCreateContext } from 'ra-core';
import clsx from 'clsx';

import { Title } from '../layout';

export const CreateView = (props: CreateViewProps) => {
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
            <Title
                title={title}
                defaultTitle={defaultTitle}
                preferenceKey={`${resource}.create.title`}
            />
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

export interface CreateViewProps {
    actions?: ReactElement | false;
    aside?: ReactElement;
    children: ReactNode;
    className?: string;
    component?: ElementType;
    sx?: SxProps;
    title?: string | ReactElement;
}
CreateView.propTypes = {
    actions: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
    aside: PropTypes.element,
    children: PropTypes.node,
    className: PropTypes.string,
    defaultTitle: PropTypes.any,
    hasList: PropTypes.bool,
    hasShow: PropTypes.bool,
    mutationOptions: PropTypes.object,
    record: PropTypes.object,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    resource: PropTypes.string,
    save: PropTypes.func,
    title: PropTypes.node,
};

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
