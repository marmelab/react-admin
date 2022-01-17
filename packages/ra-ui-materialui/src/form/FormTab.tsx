import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { FormGroupContextProvider, RaRecord } from 'ra-core';

import { FormInput } from './FormInput';
import { FormTabHeader } from './FormTabHeader';

export const FormTab = (props: FormTabProps) => {
    const {
        basePath,
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
            <span
                style={hidden ? hiddenStyle : null}
                className={contentClassName}
                id={`tabpanel-${value}`}
                aria-labelledby={`tabheader-${value}`}
                // Set undefined instead of false because WAI-ARIA Authoring Practices 1.1
                // notes that aria-hidden="false" currently behaves inconsistently across browsers.
                aria-hidden={hidden || undefined}
            >
                {React.Children.map(
                    children,
                    (input: ReactElement) =>
                        input && (
                            <FormInput
                                basePath={basePath}
                                input={input}
                                record={record}
                                resource={resource}
                                variant={input.props.variant || variant}
                                margin={input.props.margin || margin}
                            />
                        )
                )}
            </span>
        </FormGroupContextProvider>
    );

    return intent === 'header' ? renderHeader() : renderContent();
};

FormTab.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    children: PropTypes.node,
    intent: PropTypes.oneOf(['header', 'content']),
    hidden: PropTypes.bool,
    icon: PropTypes.element,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
    margin: PropTypes.oneOf(['none', 'dense', 'normal']),
    path: PropTypes.string,
    // @ts-ignore
    record: PropTypes.object,
    resource: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    variant: PropTypes.oneOf(['standard', 'outlined', 'filled']),
};

export interface FormTabProps {
    basePath?: string;
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
