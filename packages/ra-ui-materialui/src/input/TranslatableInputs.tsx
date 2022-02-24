import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactElement, ReactNode } from 'react';
import {
    TranslatableContextProvider,
    useTranslatable,
    UseTranslatableOptions,
} from 'ra-core';
import { TranslatableInputsTabs } from './TranslatableInputsTabs';
import { TranslatableInputsTabContent } from './TranslatableInputsTabContent';

/**
 * Provides a way to edit multiple languages for any input passed as children.
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
 * @param props The component props
 * @param {string} props.defaultLocale The locale selected by default. Default to 'en'.
 * @param {string[]} props.locales An array of the possible locales. For example: `['en', 'fr'].
 * @param {ReactElement} props.selector The element responsible for selecting a locale. Defaults to MUI tabs.
 */
export const TranslatableInputs = (
    props: TranslatableInputsProps
): ReactElement => {
    const {
        className,
        defaultLocale,
        locales,
        groupKey = '',
        selector = <TranslatableInputsTabs groupKey={groupKey} />,
        children,
        variant,
        margin,
    } = props;
    const context = useTranslatable({ defaultLocale, locales });

    return (
        <Root className={className}>
            <TranslatableContextProvider value={context}>
                {selector}
                {locales.map(locale => (
                    <TranslatableInputsTabContent
                        key={locale}
                        locale={locale}
                        groupKey={groupKey}
                        variant={variant}
                        margin={margin}
                    >
                        {children}
                    </TranslatableInputsTabContent>
                ))}
            </TranslatableContextProvider>
        </Root>
    );
};

export interface TranslatableInputsProps extends UseTranslatableOptions {
    className?: string;
    selector?: ReactElement;
    children: ReactNode;
    groupKey?: string;
    margin?: 'none' | 'normal' | 'dense';
    variant?: 'standard' | 'outlined' | 'filled';
}

const PREFIX = 'RaTranslatableInputs';

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    flexGrow: 1,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
}));
