import React from 'react';
import Tab, { TabProps } from '@material-ui/core/Tab';
import { useFormGroup, useTranslate } from 'ra-core';
import { makeStyles } from '@material-ui/core/styles';
import { ClassesOverride } from '../types';
import { capitalize } from 'inflection';

/**
 * Single tab which select a locale in a TranslatableInputs component.
 * @see TranslatableInputs
 */
export const TranslatebleInputsTab = (
    props: TranslatebleInputsTabProps & TabProps
) => {
    const { formGroupKeyPrefix = '', locale, ...rest } = props;
    const { invalid } = useFormGroup(`${formGroupKeyPrefix}${locale}`);
    const classes = useStyles(props);
    const translate = useTranslate();

    return (
        <Tab
            id={`translatable-header-${formGroupKeyPrefix}${locale}`}
            label={translate(`ra.locales.${locale}`, {
                _: capitalize(locale),
            })}
            className={invalid ? classes.error : undefined}
            {...rest}
        />
    );
};

const useStyles = makeStyles(theme => ({
    error: { color: theme.palette.error.main },
}));

interface TranslatebleInputsTabProps {
    classes?: ClassesOverride<typeof useStyles>;
    formGroupKeyPrefix?: string;
    locale: string;
}
