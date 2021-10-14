import React from 'react';
import Tab, { TabProps } from '@material-ui/core/Tab';
import { useFormGroup, useTranslate } from 'ra-core';
import { makeStyles } from '@material-ui/core/styles';
import { ClassesOverride } from '../types';
import { capitalize } from 'inflection';

/**
 * Single tab that selects a locale in a TranslatableInputs component.
 * @see TranslatableInputs
 */
export const TranslatableInputsTab = (
    props: TranslatableInputsTabProps & TabProps
) => {
    const { groupKey = '', locale, classes: classesOverride, ...rest } = props;
    const { invalid, touched } = useFormGroup(`${groupKey}${locale}`);

    const classes = useStyles(props);
    const translate = useTranslate();

    return (
        <Tab
            id={`translatable-header-${groupKey}${locale}`}
            label={translate(`ra.locales.${locale}`, {
                _: capitalize(locale),
            })}
            className={`${classes.root} ${
                invalid && touched ? classes.error : ''
            }`}
            {...rest}
        />
    );
};

const useStyles = makeStyles(
    theme => ({
        root: {
            fontSize: '0.8em',
            minHeight: theme.spacing(3),
            minWidth: theme.spacing(6),
        },
        error: { color: theme.palette.error.main },
    }),
    { name: 'RaTranslatableInputsTab' }
);

interface TranslatableInputsTabProps {
    classes?: ClassesOverride<typeof useStyles>;
    groupKey?: string;
    locale: string;
}
