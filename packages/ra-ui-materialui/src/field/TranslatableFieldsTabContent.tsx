import * as React from 'react';
import {
    Children,
    isValidElement,
    ReactElement,
    ReactNode,
    useState,
} from 'react';
import { styled } from '@mui/material/styles';
import set from 'lodash/set';
import get from 'lodash/get';
import {
    useTranslatableContext,
    RaRecord,
    SourceContextProvider,
    useOptionalSourceContext,
    getResourceFieldLabelKey,
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
    const { selectedLocale } = useTranslatableContext();

    const parentSourceContext = useOptionalSourceContext();
    const sourceContext = React.useMemo(
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
    const addLabel = Children.count(children) > 1;

    // As fields rely on the RecordContext to get their values and have no knowledge of the locale,
    // we need to create a new record with the values for the current locale only
    // Given the record { title: { en: 'title_en', fr: 'title_fr' } } and the locale 'fr',
    // the record for the locale 'fr' will be { title: 'title_fr' }
    const [recordForLocale] = useState(() =>
        getRecordForLocale(record, locale)
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
                        <SourceContextProvider value={sourceContext}>
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
                        </SourceContextProvider>
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

const getRecordForLocale = (record: RaRecord, locale: string) => {
    // Get all paths of the record
    const paths = getRecordPaths(record);

    // For each path, if a path ends with the locale, set the value of the path without the locale
    // to the value of the path with the locale
    const recordForLocale = paths.reduce((acc, path) => {
        if (path.includes(locale)) {
            const pathWithoutLocale = path.slice(0, -1);
            const value = get(record, path);
            return set(acc, pathWithoutLocale, value);
        }
        return acc;
    }, structuredClone(record));

    return recordForLocale;
};

const getRecordPaths = (
    record: any = {},
    path: Array<string> = []
): Array<Array<string>> =>
    Array.isArray(record) || Object(record) !== record
        ? [path]
        : Object.entries(record).flatMap(([k, v]) =>
              getRecordPaths(v, [...path, k])
          );
