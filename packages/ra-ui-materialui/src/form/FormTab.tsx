import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import { FormGroupContextProvider, RaRecord } from 'ra-core';

import { FormTabHeader } from './FormTabHeader';
import { Stack } from '@mui/material';

export const FormTab = (props: FormTabProps) => {
    const {
        className,
        contentClassName,
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
            <Stack
                alignItems="flex-start"
                sx={{ paddingLeft: 1, paddingRight: 1 }}
                style={hidden ? hiddenStyle : null}
                className={contentClassName}
                id={`tabpanel-${value}`}
                aria-labelledby={`tabheader-${value}`}
                // Set undefined instead of false because WAI-ARIA Authoring Practices 1.1
                // notes that aria-hidden="false" currently behaves inconsistently across browsers.
                aria-hidden={hidden || undefined}
            >
                {children}
            </Stack>
        </FormGroupContextProvider>
    );

    return intent === 'header' ? renderHeader() : renderContent();
};

export interface FormTabProps {
    className?: string;
    children?: ReactNode;
    contentClassName?: string;
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
