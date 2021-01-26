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
    props: TranslatableInputsTabContentProps
): ReactElement => {
    const { children, groupKey = '', locale, ...other } = props;
    const { selectedLocale, getLabel, getSource } = useTranslatableContext();
    const classes = useStyles(props);

    return (
        <FormGroupContextProvider name={`${groupKey}${locale}`}>
            <div
                role="tabpanel"
                hidden={selectedLocale !== locale}
                id={`translatable-content-${groupKey}${locale}`}
                aria-labelledby={`translatable-header-${groupKey}${locale}`}
                className={classes.root}
                {...other}
            >
                {Children.map(children, child =>
                    isValidElement(child)
                        ? cloneElement(child, {
                              ...child.props,
                              label: getLabel(child.props.source),
                              source: getSource(child.props.source, locale),
                          })
                        : null
                )}
            </div>
        </FormGroupContextProvider>
    );
};

export type TranslatableInputsTabContentProps = {
    children: ReactNode;
    classes?: ClassesOverride<typeof useStyles>;
    groupKey?: string;
    locale: string;
};

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.default,
    },
}));
