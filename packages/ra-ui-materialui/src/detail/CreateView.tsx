import * as React from 'react';
import { Children, cloneElement, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import { RaRecord, CreateControllerProps, useCreateContext } from 'ra-core';
import classnames from 'classnames';

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

    const {
        defaultTitle,
        record,
        redirect,
        resource,
        save,
        saving,
    } = useCreateContext(props);

    return (
        <Root
            className={classnames('create-page', CreateClasses.root, className)}
            {...sanitizeRestProps(rest)}
        >
            <Title title={title} record={record} defaultTitle={defaultTitle} />
            {actions &&
                cloneElement(actions, {
                    resource,
                    //  Ensure we don't override any user provided props
                    ...actions.props,
                })}
            <div
                className={classnames(CreateClasses.main, {
                    [CreateClasses.noActions]: !actions,
                })}
            >
                <Content className={CreateClasses.card}>
                    {cloneElement(Children.only(children), {
                        record,
                        redirect:
                            typeof children.props.redirect === 'undefined'
                                ? redirect
                                : children.props.redirect,
                        resource,
                        save:
                            typeof children.props.save === 'undefined'
                                ? save
                                : children.props.save,
                        saving,
                    })}
                </Content>
                {aside &&
                    cloneElement(aside, {
                        record,
                        resource,
                        save:
                            typeof children.props.save === 'undefined'
                                ? save
                                : children.props.save,
                        saving,
                    })}
            </div>
        </Root>
    );
};

interface CreateViewProps<RecordType extends RaRecord = any>
    extends CreateProps<RecordType>,
        Omit<CreateControllerProps<RecordType>, 'resource'> {
    children: ReactElement;
}

CreateView.propTypes = {
    actions: PropTypes.element,
    aside: PropTypes.element,
    children: PropTypes.element,
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

const sanitizeRestProps = ({
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
    ...rest
}) => rest;

const PREFIX = 'RaCreate';

export const CreateClasses = {
    root: `${PREFIX}-root`,
    main: `${PREFIX}-main`,
    noActions: `${PREFIX}-noActions`,
    card: `${PREFIX}-card`,
};

const Root = styled('div', { name: PREFIX })(({ theme }) => ({
    [`&.${CreateClasses.root}`]: {},

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
