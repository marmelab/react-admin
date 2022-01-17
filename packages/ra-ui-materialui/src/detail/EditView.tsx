import * as React from 'react';
import { Children, cloneElement, ReactElement } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { Card, CardContent } from '@mui/material';
import classnames from 'classnames';
import {
    EditControllerProps,
    ComponentPropType,
    useEditContext,
    useResourceDefinition,
} from 'ra-core';

import { EditActions as DefaultActions } from './EditActions';
import { TitleForRecord } from '../layout';
import { EditProps } from '../types';

export const EditView = (props: EditViewProps) => {
    const {
        actions,
        aside,
        children,
        className,
        component: Content = Card,
        title,
        mutationMode,
        ...rest
    } = props;

    const { hasList, hasShow } = useResourceDefinition();
    const {
        defaultTitle,
        record,
        redirect,
        resource,
        save,
        saving,
    } = useEditContext(props);

    const finalActions =
        typeof actions === 'undefined' && hasShow ? (
            <DefaultActions />
        ) : (
            actions
        );
    if (!children) {
        return null;
    }
    return (
        <Root
            className={classnames('edit-page', EditClasses.root, className)}
            {...sanitizeRestProps(rest)}
        >
            <TitleForRecord
                title={title}
                record={record}
                defaultTitle={defaultTitle}
            />
            {finalActions &&
                cloneElement(finalActions, {
                    data: record,
                    hasShow,
                    hasList,
                    resource,
                    //  Ensure we don't override any user provided props
                    ...finalActions.props,
                })}
            <div
                className={classnames(EditClasses.main, {
                    [EditClasses.noActions]: !finalActions,
                })}
            >
                <Content className={EditClasses.card}>
                    {record ? (
                        cloneElement(Children.only(children), {
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
                            mutationMode,
                        })
                    ) : (
                        <CardContent>&nbsp;</CardContent>
                    )}
                </Content>
                {aside &&
                    React.cloneElement(aside, {
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

interface EditViewProps
    extends EditProps,
        Omit<EditControllerProps, 'resource'> {
    children: ReactElement;
}

EditView.propTypes = {
    actions: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
    aside: PropTypes.element,
    children: PropTypes.element,
    className: PropTypes.string,
    component: ComponentPropType,
    defaultTitle: PropTypes.any,
    hasList: PropTypes.bool,
    hasShow: PropTypes.bool,
    mutationMode: PropTypes.oneOf(['pessimistic', 'optimistic', 'undoable']),
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
    basePath = null,
    defaultTitle = null,
    hasCreate = null,
    hasEdit = null,
    hasList = null,
    hasShow = null,
    history = null,
    id = null,
    isFetching = null,
    isLoading = null,
    location = null,
    match = null,
    options = null,
    queryOptions = null,
    mutationOptions = null,
    permissions = null,
    refetch = null,
    resource = null,
    save = null,
    saving = null,
    transform = null,
    ...rest
}) => rest;

const PREFIX = 'RaEdit';

export const EditClasses = {
    root: `${PREFIX}-root`,
    main: `${PREFIX}-main`,
    noActions: `${PREFIX}-noActions`,
    card: `${PREFIX}-card`,
};

const Root = styled('div', { name: PREFIX })({
    [`&.${EditClasses.root}`]: {},
    [`& .${EditClasses.main}`]: {
        display: 'flex',
    },
    [`& .${EditClasses.noActions}`]: {
        marginTop: '1em',
    },
    [`& .${EditClasses.card}`]: {
        flex: '1 1 auto',
    },
});
