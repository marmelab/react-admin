import React from 'react';
import { styled } from '@mui/material/styles';
import Tab, { TabProps } from '@mui/material/Tab';
import { useFormGroup, useTranslate } from 'ra-core';
import { capitalize } from 'inflection';
import classnames from 'classnames';

const PREFIX = 'RaTranslatableInputsTab';

const classes = {
    root: `${PREFIX}-root`,
    error: `${PREFIX}-error`,
};

const StyledTab = styled(Tab)(({ theme }) => ({
    [`&.${classes.root}`]: {
        fontSize: '0.8em',
        minHeight: theme.spacing(3),
        minWidth: theme.spacing(6),
    },

    [`& .${classes.error}`]: { color: theme.palette.error.main },
}));

/**
 * Single tab that selects a locale in a TranslatableInputs component.
 * @see TranslatableInputs
 */
export const TranslatableInputsTab = (
    props: TranslatableInputsTabProps & TabProps
) => {
    const { groupKey = '', locale, ...rest } = props;
    const { invalid, touched } = useFormGroup(`${groupKey}${locale}`);

    const translate = useTranslate();

    return (
        <StyledTab
            id={`translatable-header-${groupKey}${locale}`}
            label={translate(`ra.locales.${locale}`, {
                _: capitalize(locale),
            })}
            className={classnames(classes.root, {
                [classes.error]: invalid && touched,
            })}
            {...rest}
        />
    );
};

interface TranslatableInputsTabProps {
    groupKey?: string;
    locale: string;
}
