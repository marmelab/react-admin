import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import {
    TranslatableContextProvider,
    useTranslatable,
    TranslatableContextValue,
    UseTranslatableOptions,
    Record,
} from 'ra-core';
import { TranslatableFieldsTabs } from './TranslatableFieldsTabs';
import { TranslatableFieldsTabContent } from './TranslatableFieldsTabContent';
import { makeStyles } from '@material-ui/core/styles';
import { ClassesOverride } from '../types';

/**
 * Provides a way to show multiple languages for any fields passed as children.
 *
 * @example <caption>Basic usage</caption>
 * <TranslatableFields
 *     languages={[
 *         { locale: 'en', name: 'English' }
 *         { locale: 'fr', name: 'Français' }
 *     ]}
 * >
 *     {({ getSource }) => (
 *         <>
 *             <TextField source={getSource('title')} />
 *             <TextField source={getSource('description')} />
 *         </>
 *     )}
 * </TranslatableFields>
 *
 * @example <caption>With a custom language selector</caption>
 * <TranslatableFields
 *     selector={<MyLanguageSelector />}
 *     languages={[
 *         { locale: 'en', name: 'English' }
 *         { locale: 'fr', name: 'Français' }
 *     ]}
 * >
 *     {({ getSource }) => (
 *         <TextField source={getSource('title')} />
 *     )}
 * <TranslatableFields>
>
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
export const TranslatableFields = (
    props: TranslatableFieldsProps
): ReactElement => {
    const {
        defaultLanguage = 'en',
        languages,
        selector = <TranslatableFieldsTabs />,
        children,
        record,
        resource,
        basePath,
    } = props;
    const context = useTranslatable({ defaultLanguage, languages });
    const classes = useStyles(props);

    return (
        <div className={classes.root}>
            <TranslatableContextProvider value={context}>
                {selector}
                {typeof children === 'function'
                    ? children(context)
                    : languages.map(language => (
                          <TranslatableFieldsTabContent
                              key={language}
                              basePath={basePath}
                              locale={language}
                              record={record}
                              resource={resource}
                          >
                              {children}
                          </TranslatableFieldsTabContent>
                      ))}
            </TranslatableContextProvider>
        </div>
    );
};

export interface TranslatableFieldsProps extends UseTranslatableOptions {
    basePath: string;
    children: ReactNode | TranslatableRenderFunction;
    classes?: ClassesOverride<typeof useStyles>;
    record: Record;
    resource: string;
    selector?: ReactElement;
}

export type TranslatableRenderFunction = (
    context: TranslatableContextValue
) => ReactNode;

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
    },
}));
