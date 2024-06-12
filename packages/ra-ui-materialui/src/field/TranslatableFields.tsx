import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactElement, ReactNode } from 'react';
import {
    TranslatableContextProvider,
    useTranslatable,
    UseTranslatableOptions,
    RaRecord,
    useRecordContext,
    useResourceContext,
} from 'ra-core';
import { TranslatableFieldsTabs } from './TranslatableFieldsTabs';
import { TranslatableFieldsTabContent } from './TranslatableFieldsTabContent';

/**
 * Provides a way to show multiple languages for any field passed as children.
 * It expects the translatable values to have the following structure:
 * {
 *     name: {
 *         en: 'The english value',
 *         fr: 'The french value',
 *         tlh: 'The klingon value',
 *     },
 *     description: {
 *         en: 'The english value',
 *         fr: 'The french value',
 *         tlh: 'The klingon value',
 *     }
 * }
 *
 * @example <caption>Basic usage</caption>
 * <TranslatableFields locales={['en', 'fr']}>
 *     <TextField source={getSource('title')} />
 *     <TextField source={getSource('description')} />
 * </TranslatableFields>
 *
 * @example <caption>With a custom language selector</caption>
 * <TranslatableFields
 *     selector={<MyLanguageSelector />}
 *     locales={['en', 'fr']}
 * >
 *     <TextField source={getSource('title')} />
 * <TranslatableFields>
>
 *
 * const MyLanguageSelector = () => {
 *     const {
 *         locales,
 *         selectedLocale,
 *         selectLocale,
 *     } = useTranslatableContext();
 *
 *     return (
 *         <select onChange={selectLocale}>
 *             {locales.map((locale) => (
 *                 <option selected={locale.locale === selectedLocale}>
 *                     {locale.name}
 *                 </option>
 *             ))}
 *        </select>
 *     );
 * }
 *
 * @param props The component props
 * @param {string} props.defaultLocale The locale selected by default. Default to 'en'.
 * @param {string[]} props.locales An array of the possible locales in the form. For example [{ 'en', 'fr' }].
 * @param {ReactElement} props.selector The element responsible for selecting a locale. Defaults to Material UI tabs.
 */
export const TranslatableFields = (
    props: TranslatableFieldsProps
): ReactElement => {
    const {
        defaultLocale,
        locales,
        groupKey = '',
        selector = <TranslatableFieldsTabs groupKey={groupKey} />,
        children,
        className,
        resource: resourceProp,
    } = props;
    const record = useRecordContext(props);
    if (!record) {
        throw new Error(
            `<TranslatableFields> was called outside of a RecordContext and without a record prop. You must set the record prop.`
        );
    }
    const resource = useResourceContext(props);
    if (!resource) {
        throw new Error(
            `<TranslatableFields> was called outside of a ResourceContext and without a record prop. You must set the resource prop.`
        );
    }
    const context = useTranslatable({ defaultLocale, locales });

    return (
        <Root className={className}>
            <TranslatableContextProvider value={context}>
                {selector}
                {locales.map(locale => (
                    <TranslatableFieldsTabContent
                        key={locale}
                        locale={locale}
                        record={record}
                        resource={resourceProp}
                        groupKey={groupKey}
                    >
                        {children}
                    </TranslatableFieldsTabContent>
                ))}
            </TranslatableContextProvider>
        </Root>
    );
};

export interface TranslatableFieldsProps extends UseTranslatableOptions {
    children: ReactNode;
    className?: string;
    record?: RaRecord;
    resource?: string;
    selector?: ReactElement;
    groupKey?: string;
}

const PREFIX = 'RaTranslatableFields';

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    flexGrow: 1,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
}));
