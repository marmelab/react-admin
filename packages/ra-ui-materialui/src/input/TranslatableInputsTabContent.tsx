import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Stack, StackProps } from '@mui/material';
import clsx from 'clsx';
import {
    Children,
    cloneElement,
    isValidElement,
    ReactElement,
    ReactNode,
} from 'react';
import {
    FormGroupContextProvider,
    RaRecord,
    useTranslatableContext,
} from 'ra-core';

/**
 * Default container for a group of translatable inputs inside a TranslatableInputs component.
 * @see TranslatableInputs
 */
export const TranslatableInputsTabContent = (
    props: TranslatableInputsTabContentProps
): ReactElement => {
    const { children, groupKey = '', locale, ...other } = props;
    const { selectedLocale, getLabel, getSource } = useTranslatableContext();

    return (
        <FormGroupContextProvider name={`${groupKey}${locale}`}>
            <Root
                role="tabpanel"
                id={`translatable-content-${groupKey}${locale}`}
                aria-labelledby={`translatable-header-${groupKey}${locale}`}
                className={clsx(TranslatableInputsTabContentClasses.root, {
                    [TranslatableInputsTabContentClasses.hidden]:
                        selectedLocale !== locale,
                })}
                {...other}
            >
                {Children.map(children, child =>
                    isValidElement(child)
                        ? cloneElement(child, {
                              ...child.props,
                              label: getLabel(
                                  child.props.source,
                                  child.props.label
                              ),
                              source: getSource(child.props.source, locale),
                          })
                        : null
                )}
            </Root>
        </FormGroupContextProvider>
    );
};

export type TranslatableInputsTabContentProps<
    RecordType extends RaRecord | Omit<RaRecord, 'id'> = any
> = StackProps & {
    children: ReactNode;
    groupKey?: string;
    locale: string;
    record?: RecordType;
    resource?: string;
};

const PREFIX = 'RaTranslatableInputsTabContent';

export const TranslatableInputsTabContentClasses = {
    root: `${PREFIX}-root`,
    hidden: `${PREFIX}-hidden`,
};

const Root = styled(Stack, { name: PREFIX })(({ theme }) => ({
    [`&.${TranslatableInputsTabContentClasses.root}`]: {
        flexGrow: 1,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        borderRadius: 0,
        borderBottomLeftRadius: theme.shape.borderRadius,
        borderBottomRightRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.divider}`,
        borderTop: 0,
    },
    [`&.${TranslatableInputsTabContentClasses.hidden}`]: {
        display: 'none',
    },
}));
