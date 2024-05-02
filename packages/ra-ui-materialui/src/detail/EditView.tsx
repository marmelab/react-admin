import * as React from 'react';
import { ReactElement, ElementType } from 'react';
import { Card, CardContent, styled, SxProps } from '@mui/material';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
    ComponentPropType,
    useEditContext,
    useResourceDefinition,
} from 'ra-core';

import { EditActions } from './EditActions';
import { Title } from '../layout';

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
        <Root className={clsx('edit-page', className)} {...rest}>
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

export interface EditViewProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, 'id' | 'title'> {
    actions?: ReactElement | false;
    aside?: ReactElement;
    component?: ElementType;
    title?: string | ReactElement;
    sx?: SxProps;
}

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
