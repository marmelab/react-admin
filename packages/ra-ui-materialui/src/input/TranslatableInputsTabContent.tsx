import * as React from 'react';
import { ReactElement, ReactNode, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import { Stack, StackProps } from '@mui/material';
import clsx from 'clsx';
import {
    FormGroupContextProvider,
    RaRecord,
    RecordContextProvider,
    SourceContextProvider,
    useRecordContext,
    useSourceContext,
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
    const { selectedLocale, getRecordForLocale } = useTranslatableContext();
    const parentSourceContext = useSourceContext();
    const record = useRecordContext(props);

    // The SourceContext will be read by children of TranslatableInputs to compute their composed source and label
    //
    // <TranslatableInputs locales={['en', 'fr']} /> => SourceContext is "fr"
    //     <TextInput source="description" /> => final source for this input will be "description.fr"
    // </TranslatableInputs>
    const sourceContext = useMemo(
        () => ({
            getSource: (source: string) => {
                if (!source) {
                    throw new Error(
                        'Children of TranslatableInputs must have a source'
                    );
                }
                return parentSourceContext.getSource(`${source}.${locale}`);
            },
            getLabel: (source: string) => {
                return parentSourceContext.getLabel(source);
            },
        }),
        [locale, parentSourceContext]
    );

    // As fields rely on the RecordContext to get their values and have no knowledge of the locale,
    // we need to create a new record with the values for the current locale only
    // Given the record { title: { en: 'title_en', fr: 'title_fr' } } and the locale 'fr',
    // the record for the locale 'fr' will be { title: 'title_fr' }
    const recordForLocale = useMemo(
        () => getRecordForLocale(record, locale),
        [getRecordForLocale, record, locale]
    );

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
                <SourceContextProvider value={sourceContext}>
                    <RecordContextProvider value={recordForLocale}>
                        {children}
                    </RecordContextProvider>
                </SourceContextProvider>
            </Root>
        </FormGroupContextProvider>
    );
};

export type TranslatableInputsTabContentProps<
    RecordType extends RaRecord | Omit<RaRecord, 'id'> = any,
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
