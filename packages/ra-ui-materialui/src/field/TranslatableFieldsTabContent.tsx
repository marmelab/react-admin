import * as React from 'react';
import {
    Children,
    isValidElement,
    ReactElement,
    ReactNode,
    useMemo,
} from 'react';
import { styled } from '@mui/material/styles';
import {
    useTranslatableContext,
    RaRecord,
    RecordContextProvider,
} from 'ra-core';
import { Labeled } from '../Labeled';

/**
 * Default container for a group of translatable fields inside a TranslatableFields components.
 * @see TranslatableFields
 */
export const TranslatableFieldsTabContent = (
    props: TranslatableFieldsTabContentProps
): ReactElement => {
    const {
        children,
        groupKey = '',
        locale,
        record,
        resource,
        className,
        ...other
    } = props;
    const { selectedLocale, getRecordForLocale } = useTranslatableContext();
    const addLabel = Children.count(children) > 1;

    // As fields rely on the RecordContext to get their values and have no knowledge of the locale,
    // we need to create a new record with the values for the current locale only
    // Given the record { title: { en: 'title_en', fr: 'title_fr' } } and the locale 'fr',
    // the record for the locale 'fr' will be { title: 'title_fr' }
    const recordForLocale = useMemo(
        () => getRecordForLocale(record, locale),
        [getRecordForLocale, record, locale]
    );

    return (
        <Root
            role="tabpanel"
            hidden={selectedLocale !== locale}
            id={`translatable-content-${groupKey}${locale}`}
            aria-labelledby={`translatable-header-${groupKey}${locale}`}
            className={className}
            {...other}
        >
            {Children.map(children, field =>
                field && isValidElement<any>(field) ? (
                    <RecordContextProvider value={recordForLocale}>
                        <div>
                            {addLabel ? (
                                <Labeled
                                    resource={resource}
                                    label={field.props.label}
                                    source={field.props.source}
                                >
                                    {field}
                                </Labeled>
                            ) : (
                                field
                            )}
                        </div>
                    </RecordContextProvider>
                ) : null
            )}
        </Root>
    );
};

export type TranslatableFieldsTabContentProps = {
    children: ReactNode;
    className?: string;
    formGroupKeyPrefix?: string;
    groupKey: string;
    locale: string;
    record: RaRecord;
    resource: string;
};

const PREFIX = 'RaTranslatableFieldsTabContent';

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(2),
    borderRadius: 0,
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    borderTop: 0,
}));
