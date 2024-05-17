import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import { FormGroupContextProvider } from 'ra-core';
import { Stack, StackProps, TabProps as MuiTabProps } from '@mui/material';

import { FormTabHeader } from './FormTabHeader';

export const FormTab = (props: FormTabProps) => {
    const {
        children,
        className,
        contentClassName,
        count,
        hidden,
        icon,
        intent,
        label,
        onChange,
        path,
        resource,
        syncWithLocation,
        value,
        ...rest
    } = props;
    if (typeof value === 'undefined') {
        throw new Error('the value prop is required at runtime');
    }

    const renderHeader = () => (
        <FormTabHeader
            label={label}
            count={count}
            value={value}
            icon={icon}
            className={className}
            syncWithLocation={syncWithLocation}
            onChange={onChange}
            {...sanitizeRestProps(rest)}
        />
    );

    const renderContent = () => (
        <FormGroupContextProvider name={value.toString()}>
            <Stack
                alignItems="flex-start"
                style={hidden ? hiddenStyle : undefined}
                className={contentClassName}
                id={`tabpanel-${value}`}
                aria-labelledby={`tabheader-${value}`}
                // Set undefined instead of false because WAI-ARIA Authoring Practices 1.1
                // notes that aria-hidden="false" currently behaves inconsistently across browsers.
                aria-hidden={hidden || undefined}
                {...rest}
            >
                {children}
            </Stack>
        </FormGroupContextProvider>
    );

    return intent === 'header' ? renderHeader() : renderContent();
};

export interface FormTabProps
    extends Omit<StackProps, 'color'>,
        Omit<MuiTabProps, 'children' | 'classes' | 'ref'> {
    className?: string;
    children?: ReactNode;
    contentClassName?: string;
    count?: ReactNode;
    hidden?: boolean;
    icon?: ReactElement;
    intent?: 'header' | 'content';
    label: string | ReactElement;
    path?: string;
    resource?: string;
    syncWithLocation?: boolean;
    value?: string | number;
}

FormTab.displayName = 'FormTab';

const hiddenStyle = { display: 'none' };

const sanitizeRestProps = ({
    classes,
    ref,
    margin,
    ...rest
}: Omit<
    FormTabProps,
    | 'className'
    | 'contentClassName'
    | 'children'
    | 'hidden'
    | 'icon'
    | 'intent'
    | 'label'
    | 'onChange'
    | 'path'
    | 'resource'
    | 'syncWithLocation'
    | 'value'
>) => rest;
