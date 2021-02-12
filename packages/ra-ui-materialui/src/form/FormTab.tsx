import * as React from 'react';
import { FC, ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import MuiTab from '@material-ui/core/Tab';
import classnames from 'classnames';
import {
    FormGroupContextProvider,
    useTranslate,
    Record,
    useFormGroup,
} from 'ra-core';

import FormInput from './FormInput';

const hiddenStyle = { display: 'none' };

const FormTab: FC<FormTabProps> = ({
    basePath,
    className,
    classes,
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
}) => {
    const renderHeader = () => (
        <FormTabHeader
            label={label}
            value={value}
            icon={icon}
            className={className}
            classes={classes}
            {...rest}
        />
    );

    const renderContent = () => (
        <FormGroupContextProvider name={value}>
            <span
                style={hidden ? hiddenStyle : null}
                className={contentClassName}
                id={`tabpanel-${value}`}
                aria-labelledby={`tabheader-${value}`}
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

export const FormTabHeader = ({
    classes,
    label,
    value,
    icon,
    className,
    ...rest
}) => {
    const translate = useTranslate();
    const location = useLocation();
    const formGroup = useFormGroup(value);

    return (
        <MuiTab
            label={translate(label, { _: label })}
            value={value}
            icon={icon}
            className={classnames('form-tab', className, {
                [classes.errorTabButton]:
                    formGroup.invalid &&
                    formGroup.touched &&
                    location.pathname !== value,
            })}
            component={Link}
            to={{ ...location, pathname: value }}
            id={`tabheader-${value}`}
            aria-controls={`tabpanel-${value}`}
            {...rest}
        />
    );
};

FormTab.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    children: PropTypes.node,
    intent: PropTypes.oneOf(['header', 'content']),
    hidden: PropTypes.bool,
    icon: PropTypes.element,
    label: PropTypes.string.isRequired,
    margin: PropTypes.oneOf(['none', 'dense', 'normal']),
    path: PropTypes.string,
    // @ts-ignore
    record: PropTypes.object,
    resource: PropTypes.string,
    value: PropTypes.string,
    variant: PropTypes.oneOf(['standard', 'outlined', 'filled']),
};

export interface FormTabProps {
    basePath?: string;
    className?: string;
    classes?: object;
    children?: ReactNode;
    contentClassName?: string;
    hidden?: boolean;
    icon?: ReactElement;
    intent?: 'header' | 'content';
    label: string;
    margin?: 'none' | 'normal' | 'dense';
    path?: string;
    record?: Record;
    resource?: string;
    value?: string;
    variant?: 'standard' | 'outlined' | 'filled';
}

FormTab.displayName = 'FormTab';

export default FormTab;
