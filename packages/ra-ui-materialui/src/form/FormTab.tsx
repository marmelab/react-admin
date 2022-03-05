import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { FormGroupContextProvider, RaRecord } from 'ra-core';
import { Stack, StackProps } from '@mui/material';

import { FormTabHeader } from './FormTabHeader';

export const FormTab = (props: FormTabProps) => {
    const {
        className,
        contentClassName,
        children,
        hidden,
        icon,
        intent,
        label,
        onChange,
        path,
        record,
        resource,
        syncWithLocation,
        value,
        ...rest
    } = props;

    const renderHeader = () => (
        <FormTabHeader
            label={label}
            value={value}
            icon={icon}
            className={className}
            syncWithLocation={syncWithLocation}
            onChange={onChange}
        />
    );

    const renderContent = () => (
        <FormGroupContextProvider name={value.toString()}>
            <Stack
                alignItems="flex-start"
                style={hidden ? hiddenStyle : null}
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

FormTab.propTypes = {
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    children: PropTypes.node,
    intent: PropTypes.oneOf(['header', 'content']),
    hidden: PropTypes.bool,
    icon: PropTypes.element,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
    path: PropTypes.string,
    // @ts-ignore
    record: PropTypes.object,
    resource: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export interface FormTabProps extends StackProps {
    className?: string;
    children?: ReactNode;
    contentClassName?: string;
    hidden?: boolean;
    icon?: ReactElement;
    intent?: 'header' | 'content';
    label: string | ReactElement;
    path?: string;
    record?: RaRecord;
    resource?: string;
    syncWithLocation?: boolean;
    value?: string | number;
}

FormTab.displayName = 'FormTab';

const hiddenStyle = { display: 'none' };
