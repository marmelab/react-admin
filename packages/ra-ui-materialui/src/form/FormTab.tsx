import * as React from 'react';
import { ComponentType, CSSProperties, ReactElement, ReactNode } from 'react';
import { FormGroupContextProvider, RaRecord } from 'ra-core';

import { FormTabHeader } from './FormTabHeader';
import { Stack } from '@mui/material';

export const FormTab = (props: FormTabProps) => {
    const {
        className,
        contentClassName,
        contentComponent: Component = DefaultComponent,
        children,
        hidden,
        icon,
        intent,
        label,
        margin,
        path,
        record,
        resource,
        variant,
        value,
        ...rest
    } = props;
    const renderHeader = () => (
        <FormTabHeader
            label={label}
            value={value}
            icon={icon}
            className={className}
            {...rest}
        />
    );

    const renderContent = () => (
        <FormGroupContextProvider name={value.toString()}>
            <Component
                style={hidden ? hiddenStyle : null}
                className={contentClassName}
                id={`tabpanel-${value}`}
                aria-labelledby={`tabheader-${value}`}
                // Set undefined instead of false because WAI-ARIA Authoring Practices 1.1
                // notes that aria-hidden="false" currently behaves inconsistently across browsers.
                aria-hidden={hidden || undefined}
            >
                {children}
            </Component>
        </FormGroupContextProvider>
    );

    return intent === 'header' ? renderHeader() : renderContent();
};

export interface FormTabProps {
    className?: string;
    children?: ReactNode;
    contentClassName?: string;
    contentComponent?: ComponentType<{
        className?: string;
        id?: string;
        style: CSSProperties;
    }>;
    hidden?: boolean;
    icon?: ReactElement;
    intent?: 'header' | 'content';
    label: string | ReactElement;
    margin?: 'none' | 'normal' | 'dense';
    path?: string;
    record?: RaRecord;
    resource?: string;
    syncWithLocation?: boolean;
    value?: string | number;
    variant?: 'standard' | 'outlined' | 'filled';
}

FormTab.displayName = 'FormTab';

const hiddenStyle = { display: 'none' };

const DefaultComponent = ({ children, ...props }) => (
    <Stack
        alignItems="flex-start"
        sx={{ paddingLeft: 1, paddingRight: 1 }}
        {...props}
    >
        {children}
    </Stack>
);
