import React from 'react';
import { styled } from '@mui/material/styles';
import Tab, { TabProps } from '@mui/material/Tab';
import { useFormGroup, useTranslate } from 'ra-core';
import { capitalize } from 'inflection';
import clsx from 'clsx';

/**
 * Single tab that selects a locale in a TranslatableInputs component.
 * @see TranslatableInputs
 */
export const TranslatableInputsTab = (
    props: TranslatableInputsTabProps & TabProps
) => {
    const { groupKey = '', locale, ...rest } = props;
    const { isValid } = useFormGroup(`${groupKey}${locale}`);
    const translate = useTranslate();

    return (
        <StyledTab
            id={`translatable-header-${groupKey}${locale}`}
            label={translate(`ra.locales.${locale}`, {
                _: capitalize(locale),
            })}
            className={clsx(TranslatableInputsTabClasses.root, {
                [TranslatableInputsTabClasses.error]: !isValid,
            })}
            {...rest}
        />
    );
};

export interface TranslatableInputsTabProps {
    groupKey?: string;
    locale: string;
}

const PREFIX = 'RaTranslatableInputsTab';

export const TranslatableInputsTabClasses = {
    root: `${PREFIX}-root`,
    error: `${PREFIX}-error`,
};

const StyledTab = styled(Tab, { name: PREFIX })(({ theme }) => ({
    [`&.${TranslatableInputsTabClasses.root}`]: {
        fontSize: '0.8em',
        minHeight: theme.spacing(3),
        minWidth: theme.spacing(6),
    },

    [`&.${TranslatableInputsTabClasses.error}`]: {
        color: theme.palette.error.main,
    },
}));
