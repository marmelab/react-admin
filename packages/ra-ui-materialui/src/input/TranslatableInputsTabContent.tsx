import * as React from 'react';
import {
    Children,
    cloneElement,
    isValidElement,
    ReactElement,
    ReactNode,
} from 'react';
import { FormGroupContextProvider, useTranslatableContext } from 'ra-core';
import { makeStyles } from '@material-ui/core/styles';
import { ClassesOverride } from '../types';

/**
 * Default container for a group of translatable inputs inside a TranslatableInputs components.
 * @see TranslatableInputs
 */
export const TranslatableInputsTabContent = (
    props: LanguageTabProps
): ReactElement => {
    const { children, formGroupKeyPrefix = '', locale, ...other } = props;
    const {
        selectedLanguage,
        getInputLabel,
        getSource,
    } = useTranslatableContext();
    const classes = useStyles(props);

    return (
        <FormGroupContextProvider name={`${formGroupKeyPrefix}${locale}`}>
            <div
                role="tabpanel"
                hidden={selectedLanguage !== locale}
                id={`translatable-${locale}`}
                aria-labelledby={`translatable-${locale}`}
                className={classes.root}
                {...other}
            >
                {Children.map(children, child =>
                    isValidElement(child)
                        ? cloneElement(child, {
                              ...child.props,
                              label: getInputLabel(child.props.source),
                              source: getSource(child.props.source),
                          })
                        : null
                )}
            </div>
        </FormGroupContextProvider>
    );
};

export type LanguageTabProps = {
    children: ReactNode;
    classes?: ClassesOverride<typeof useStyles>;
    formGroupKeyPrefix?: string;
    locale: string;
};

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.default,
    },
}));
