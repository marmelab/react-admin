import * as React from 'react';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MuiTab from '@material-ui/core/Tab';
import classnames from 'classnames';
import { useTranslate, useFormGroup } from 'ra-core';
import { useForm } from 'react-final-form';

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
    const form = useForm();
    const [showError, setShowError] = React.useState(false);

    useEffect(() => {
        const unsubscribe = form.subscribe(
            state => {
                if (!showError && (state.submitting || state.submitFailed)) {
                    setShowError(true);
                }
            },
            { submitting: true, submitFailed: true }
        );

        return unsubscribe;
    }, [form, showError]);

    return (
        <MuiTab
            label={translate(label, { _: label })}
            value={value}
            icon={icon}
            className={classnames('form-tab', className, {
                [classes.errorTabButton]:
                    formGroup.invalid &&
                    (formGroup.touched || showError) &&
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
