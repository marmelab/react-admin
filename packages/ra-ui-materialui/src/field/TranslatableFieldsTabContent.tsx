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
    useOptionalSourceContext,
    SourceContextProvider,
    getResourceFieldLabelKey,
    useResourceContext,
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
        resource: resourceProp,
        className,
        ...other
    } = props;
    const { selectedLocale, getRecordForLocale } = useTranslatableContext();
    const addLabel = Children.count(children) > 1;

    const parentSourceContext = useOptionalSourceContext();
    const resource = useResourceContext(props);
    if (!resource) {
        throw new Error(
            `<TranslatableFieldsTabContent> was called outside of a ResourceContext and without a record prop. You must set the resource prop.`
        );
    }
    const sourceContext = useMemo(
        () => ({
            getSource: (source: string) =>
                parentSourceContext
                    ? parentSourceContext.getSource(`${source}.${locale}`)
                    : `${source}.${locale}`,
            getLabel: (source: string) =>
                parentSourceContext
                    ? parentSourceContext.getLabel(source)
                    : getResourceFieldLabelKey(resource, source),
        }),
        [locale, parentSourceContext, resource]
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
        <Root
            role="tabpanel"
            hidden={selectedLocale !== locale}
            id={`translatable-content-${groupKey}${locale}`}
            aria-labelledby={`translatable-header-${groupKey}${locale}`}
            className={className}
            {...other}
        >
            <RecordContextProvider value={recordForLocale}>
                <SourceContextProvider value={sourceContext}>
                    {Children.map(children, field =>
                        field && isValidElement<any>(field) ? (
                            <div>
                                {addLabel ? (
                                    <Labeled
                                        // Only pass the resource if it was overridden through props to avoid
                                        // the default inference to potentially override label set by SourceContext
                                        resource={resourceProp}
                                        label={field.props.label}
                                        source={field.props.source}
                                    >
                                        {field}
                                    </Labeled>
                                ) : (
                                    field
                                )}
                            </div>
                        ) : null
                    )}
                </SourceContextProvider>
            </RecordContextProvider>
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
    resource?: string;
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
