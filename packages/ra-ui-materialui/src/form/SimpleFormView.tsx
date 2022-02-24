import * as React from 'react';
import { ComponentType, ReactElement, ReactNode } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Stack } from '@mui/material';
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
    saving,
    submitOnEnter = true,
    toolbar = DefaultToolbar,
    ...rest
}: SimpleFormViewProps): ReactElement => (
    <form
        className={clsx('simple-form', className)}
        onSubmit={handleSubmit}
        {...sanitizeRestProps(rest)}
    >
        <Component>{children}</Component>
        {toolbar}
    </form>
);

SimpleFormView.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    invalid: PropTypes.bool,
    mutationMode: PropTypes.oneOf(['pessimistic', 'optimistic', 'undoable']),
    pristine: PropTypes.bool,
    // @ts-ignore
    record: PropTypes.object,
    resource: PropTypes.string,
    saving: PropTypes.bool,
    submitOnEnter: PropTypes.bool,
    toolbar: PropTypes.oneOfType([PropTypes.element, PropTypes.oneOf([false])]),
    validate: PropTypes.func,
};

const DefaultComponent = ({ children, ...props }) => (
    <Stack
        alignItems="flex-start"
        sx={{ paddingLeft: 1, paddingRight: 1 }}
        {...props}
    >
        {children}
    </Stack>
);
const DefaultToolbar = <Toolbar />;

export interface SimpleFormViewProps extends FormRenderProps {
    children?: ReactNode;
    className?: string;
    component?: ComponentType;
    mutationMode?: MutationMode;
    record?: Partial<RaRecord>;
    resource?: string;
    toolbar?: ReactElement | false;
    submitOnEnter?: boolean;
}

const sanitizeRestProps = ({ save = null, ...props }) => props;
