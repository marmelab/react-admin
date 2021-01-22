import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import {
    TranslatableContextProvider,
    useTranslatable,
    UseTranslatableOptions,
} from 'ra-core';
import { TranslatableInputsTabs } from './TranslatableInputsTabs';
import { TranslatableInputsTabContent } from './TranslatableInputsTabContent';

/**
 * Provides a way to edit multiple languages for any inputs passed as children.
 *
 * @example <caption>Basic usage</caption>
 * <TranslatableInputs locales={['en', 'fr']}>
 *     <TextInput source="title" />
 *     <RichTextInput source="description" />
 * </Translatable>
 *
 * @example <caption>With a custom language selector</caption>
 * <TranslatableInputs
 *     selector={<MyLanguageSelector />}
 *     locales={['en', 'fr']}
 * >
 *     <TextInput source="title" />
 * </Translatable>
 *
 * const MyLanguageSelector = () => {
 *     const {
 *         locales,
 *         selectedLocale,
 *         selectLocale,
 *     } = useTranslatableContext();
 *
 *     return (
 *         <select onChange={event => selectLocale(event.target.value)}>
 *             {locales.map((locale) => (
 *                 <option selected={locale === selectedLocale}>
 *                     {locale}
 *                 </option>
 *             ))}
 *        </select>
 *     );
 * }
 *
 * * @param props The component props
 * * @param {string} props.defaultLocale The locale selected by default. Default to 'en'.
 * * @param {string[]} props.locales An array of the possible locales. For example: `['en', 'fr'].
 * * @param {ReactElement} props.selector The element responsible for selecting a locale. Defaults to Material UI tabs.
 */
export const TranslatableInputs = (props: TranslatableProps): ReactElement => {
    const {
        defaultLocale = 'en',
        locales,
        formGroupKeyPrefix = '',
        selector = (
            <TranslatableInputsTabs formGroupKeyPrefix={formGroupKeyPrefix} />
        ),
        children,
    } = props;
    const context = useTranslatable({ defaultLocale, locales });

    return (
        <TranslatableContextProvider value={context}>
            {selector}
            {locales.map(locale => (
                <TranslatableInputsTabContent
                    key={locale}
                    locale={locale}
                    formGroupKeyPrefix={formGroupKeyPrefix}
                >
                    {children}
                </TranslatableInputsTabContent>
            ))}
        </TranslatableContextProvider>
    );
};

export interface TranslatableProps extends UseTranslatableOptions {
    selector?: ReactElement;
    children: ReactNode;
    formGroupKeyPrefix?: string;
}
