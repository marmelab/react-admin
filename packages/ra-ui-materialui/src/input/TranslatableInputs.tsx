import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import {
    TranslatableContextProvider,
    useTranslatable,
    TranslatableContextValue,
    UseTranslatableOptions,
} from 'ra-core';
import { TranslatableInputsTabs } from './TranslatableInputsTabs';
import { TranslatableInputsTabContent } from './TranslatableInputsTabContent';

/**
 * Provides a way to edit multiple languages for any inputs passed as children.
 *
 * @example <caption>Basic usage</caption>
 * <Translatable
 *     languages={[
 *         { locale: 'en', name: 'English' }
 *         { locale: 'fr', name: 'Français' }
 *     ]}
 * >
 *     {({ getSource }) => (
 *         <>
 *             <TextInput source={getSource('title')} />
 *             <RichTextInput source={getSource('description')} />
 *         </>
 *     )}
 * </Translatable>
 *
 * @example <caption>With a custom language selector</caption>
 * <Translatable
 *     selector={<MyLanguageSelector />}
 *     languages={[
 *         { locale: 'en', name: 'English' }
 *         { locale: 'fr', name: 'Français' }
 *     ]}
 * >
 *     {({ getSource }) => (
 *         <TextInput source={getSource('title')} />
 *     )}
 * </Translatable>
 *
 * const MyLanguageSelector = () => {
 *     const {
 *         languages,
 *         selectedLanguage,
 *         selectLanguage,
 *     } = useTranslatable(availableLanguages, validate);
 *
 *     return (
 *         <select onChange={selectLanguage}>
 *             {languages.map((language) => (
 *                 <option selected={language.locale === selectedLanguage}>
 *                     {language.name}
 *                 </option>
 *             ))}
 *        </select>
 *     );
 * }
 *
 * * @param props The component props
 * * @param {string} props.defaultLanguage The language selected by default (accept the language locale). Default to 'en'.
 * * @param {Language[]} props.languages An array of the possible languages in the form: `[{ locale: 'en', language: 'English' }].
 * * @param {ReactElement} props.selector The element responsible for selecting a language. Defaults to Material UI tabs.
 */
export const TranslatableInputs = (props: TranslatableProps): ReactElement => {
    const {
        defaultLanguage = 'en',
        languages,
        formGroupKeyPrefix = '',
        selector = (
            <TranslatableInputsTabs formGroupKeyPrefix={formGroupKeyPrefix} />
        ),
        children,
    } = props;
    const context = useTranslatable({ defaultLanguage, languages });

    return (
        <TranslatableContextProvider value={context}>
            {selector}
            {typeof children === 'function'
                ? children(context)
                : languages.map(language => (
                      <TranslatableInputsTabContent
                          key={language}
                          locale={language}
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
    children: ReactNode | TranslatableInputRenderFunction;
    formGroupKeyPrefix?: string;
}

export type TranslatableInputRenderFunction = (
    context: TranslatableContextValue
) => ReactNode;
