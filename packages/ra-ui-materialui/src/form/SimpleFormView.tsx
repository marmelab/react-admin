import * as React from 'react';
import { ComponentType, ReactElement, ReactNode } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { CardContent, Stack, SxProps, StackProps } from '@mui/material';
import { FormRenderProps, MutationMode, RaRecord } from 'ra-core';

import { Toolbar } from './Toolbar';

export const SimpleFormView = ({
    children,
    className,
    component: Component = DefaultComponent,
    handleSubmit,
    mutationMode,
    record,
    resource,
    sx,
    toolbar = DefaultToolbar,
    ...rest
}: SimpleFormViewProps): ReactElement => (
    <form className={clsx('simple-form', className)} onSubmit={handleSubmit}>
        <Component sx={sx}>
            <Stack alignItems="flex-start" {...sanitizeRestProps(rest)}>
                {children}
            </Stack>
        </Component>
        {toolbar}
    </form>
);

SimpleFormView.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    mutationMode: PropTypes.oneOf(['pessimistic', 'optimistic', 'undoable']),
    // @ts-ignore
    record: PropTypes.object,
    resource: PropTypes.string,
    toolbar: PropTypes.oneOfType([PropTypes.element, PropTypes.oneOf([false])]),
    validate: PropTypes.func,
};

const DefaultComponent = ({ children, sx }) => (
    <CardContent sx={sx}>{children}</CardContent>
);
const DefaultToolbar = <Toolbar />;

export interface SimpleFormViewProps extends FormRenderProps, StackProps {
    children?: ReactNode;
    className?: string;
    component?: ComponentType<any>;
    mutationMode?: MutationMode;
    record?: Partial<RaRecord>;
    resource?: string;
    toolbar?: ReactElement | false;
    sx?: SxProps;
}

const sanitizeRestProps = ({ save = null, ...props }) => props;
