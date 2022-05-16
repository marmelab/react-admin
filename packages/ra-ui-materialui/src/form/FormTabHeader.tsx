import * as React from 'react';
import { isValidElement, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { Tab as MuiTab, TabProps as MuiTabProps } from '@mui/material';
import clsx from 'clsx';
import { useTranslate, useFormGroup } from 'ra-core';
import { useFormState } from 'react-hook-form';

import { TabbedFormClasses } from './TabbedFormView';

export const FormTabHeader = ({
    label,
    value,
    icon,
    className,
    onChange,
    syncWithLocation,
    ...rest
}: FormTabHeaderProps): ReactElement => {
    const translate = useTranslate();
    const location = useLocation();
    const { isSubmitted } = useFormState();
    const formGroup = useFormGroup(value.toString());

    const propsForLink = {
        component: Link,
        to: { ...location, pathname: value },
    };

    return (
        <MuiTab
            label={
                isValidElement(label) ? label : translate(label, { _: label })
            }
            value={value}
            icon={icon}
            className={clsx('form-tab', className, {
                [TabbedFormClasses.errorTabButton]:
                    !formGroup.isValid && (formGroup.isTouched || isSubmitted),
                error:
                    !formGroup.isValid && (formGroup.isTouched || isSubmitted),
            })}
            {...(syncWithLocation ? propsForLink : {})} // to avoid TypeScript screams, see https://github.com/mui-org/material-ui/issues/9106#issuecomment-451270521
            id={`tabheader-${value}`}
            aria-controls={`tabpanel-${value}`}
            onChange={onChange}
            {...rest}
        />
    );
};

interface FormTabHeaderProps extends Omit<MuiTabProps, 'children'> {
    className?: string;
    hidden?: boolean;
    icon?: ReactElement;
    intent?: 'header' | 'content';
    label: string | ReactElement;
    margin?: 'none' | 'normal' | 'dense';
    onChange?: (event: any) => void;
    path?: string;
    resource?: string;
    syncWithLocation?: boolean;
    value?: string | number;
    variant?: 'standard' | 'outlined' | 'filled';
}

FormTabHeader.propTypes = {
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
