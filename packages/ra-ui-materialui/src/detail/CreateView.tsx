import * as React from 'react';
import { ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import { RaRecord, CreateControllerProps, useCreateContext } from 'ra-core';
import clsx from 'clsx';

import { CreateProps } from '../types';
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

    const { resource, defaultTitle } = useCreateContext(props);

    return (
        <Root
            className={clsx('create-page', className)}
            {...sanitizeRestProps(rest)}
        >
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

interface CreateViewProps<RecordType extends RaRecord = any>
    extends CreateProps<RecordType>,
        Omit<CreateControllerProps<RecordType>, 'resource'> {
    children: ReactNode;
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

/* eslint-disable @typescript-eslint/no-unused-vars */
const sanitizeRestProps = ({
    addMiddleware = null,
    defaultTitle = null,
    hasCreate = null,
    hasEdit = null,
    hasList = null,
    hasShow = null,
    history = null,
    isFetching = null,
    isLoading = null,
    location = null,
    match = null,
    mutationOptions = null,
    options = null,
    permissions = null,
    save = null,
    saving = null,
    transform = null,
    removeMiddleware = null,
    ...rest
}) => rest;
/* eslint-enable @typescript-eslint/no-unused-vars */

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
