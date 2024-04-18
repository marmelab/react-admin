import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { Card, CardContent } from '@mui/material';
import clsx from 'clsx';
import {
    ComponentPropType,
    useEditContext,
    useResourceDefinition,
} from 'ra-core';

import { EditActions } from './EditActions';
import { Title } from '../layout';
import { EditProps } from '../types';

const defaultActions = <EditActions />;

export const EditView = (props: EditViewProps) => {
    const {
        actions,
        aside,
        children,
        className,
        component: Content = Card,
        title,
        ...rest
    } = props;

    const { hasShow } = useResourceDefinition();
    const { resource, defaultTitle, record } = useEditContext();

    const finalActions =
        typeof actions === 'undefined' && hasShow ? defaultActions : actions;
    if (!children) {
        return null;
    }
    return (
        <Root
            className={clsx('edit-page', className)}
            {...sanitizeRestProps(rest)}
        >
            <Title
                title={title}
                defaultTitle={defaultTitle}
                preferenceKey={`${resource}.edit.title`}
            />
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

export type EditViewProps = Omit<
    EditProps,
    | 'resource'
    | 'id'
    | 'mutationMode'
    | 'mutationOptions'
    | 'queryOptions'
    | 'redirect'
    | 'transform'
    | 'disableAuthentication'
>;

EditView.propTypes = {
    actions: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
    aside: PropTypes.element,
    className: PropTypes.string,
    component: ComponentPropType,
    defaultTitle: PropTypes.any,
    hasList: PropTypes.bool,
    hasShow: PropTypes.bool,
    record: PropTypes.object,
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
    id = null,
    isFetching = null,
    isLoading = null,
    isPending = null,
    location = null,
    match = null,
    options = null,
    queryOptions = null,
    mutationOptions = null,
    permissions = null,
    refetch = null,
    removeMiddleware = null,
    resource = null,
    save = null,
    saving = null,
    transform = null,
    ...rest
}) => rest;
/* eslint-enable @typescript-eslint/no-unused-vars */

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
