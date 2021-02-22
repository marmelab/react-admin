import * as React from 'react';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import MuiTab from '@material-ui/core/Tab';
import classnames from 'classnames';
import { useTranslate, useFormGroup } from 'ra-core';
import { useTabbedFormViewStyles } from './TabbedFormView';
import { ClassesOverride } from '../types';

export const FormTabHeader = ({
    classes,
    label,
    value,
    icon,
    className,
    syncWithLocation,
    ...rest
}: FormTabHeaderProps): ReactElement => {
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
            component={syncWithLocation ? Link : undefined}
            to={{ ...location, pathname: value }}
            id={`tabheader-${value}`}
            aria-controls={`tabpanel-${value}`}
            {...rest}
        />
    );
};

interface FormTabHeaderProps {
    basePath?: string;
    className?: string;
    classes?: ClassesOverride<typeof useTabbedFormViewStyles>;
    hidden?: boolean;
    icon?: ReactElement;
    intent?: 'header' | 'content';
    label: string;
    margin?: 'none' | 'normal' | 'dense';
    path?: string;
    resource?: string;
    syncWithLocation?: boolean;
    value?: string;
    variant?: 'standard' | 'outlined' | 'filled';
}

FormTabHeader.propTypes = {
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
