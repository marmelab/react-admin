import * as React from 'react';
import { SxProps, styled } from '@mui/material/styles';
import { StackProps, useThemeProps } from '@mui/material';
import { ReactElement, ReactNode } from 'react';
import {
    TranslatableContextProvider,
    useTranslatable,
    UseTranslatableOptions,
} from 'ra-core';
import clsx from 'clsx';
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
 * </TranslatableInputs>
 *
 * @example <caption>With a custom language selector</caption>
 * <TranslatableInputs
 *     selector={<MyLanguageSelector />}
 *     locales={['en', 'fr']}
 * >
 *     <TextInput source="title" />
 * </TranslatableInputs>
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
 * @param {ReactElement} props.selector The element responsible for selecting a locale. Defaults to Material UI tabs.
 */
export const TranslatableInputs = (
    inProps: TranslatableInputsProps
): ReactElement => {
    const props = useThemeProps({
        props: inProps,
        name: 'RaTranslatableInputs',
    });
    const {
        className,
        defaultLocale,
        fullWidth,
        locales,
        groupKey = '',
        selector = <TranslatableInputsTabs groupKey={groupKey} />,
        children,
        margin,
        sx,
        StackProps = {},
    } = props;
    const context = useTranslatable({ defaultLocale, locales });

    return (
        <Root
            className={clsx(className, TranslatableInputsClasses.root, {
                [TranslatableInputsClasses.fullWidth]: fullWidth,
            })}
            sx={sx}
        >
            <TranslatableContextProvider value={context}>
                {selector}
                {locales.map(locale => (
                    <TranslatableInputsTabContent
                        key={locale}
                        locale={locale}
                        groupKey={groupKey}
                        margin={margin}
                        {...StackProps}
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
    fullWidth?: boolean;
    groupKey?: string;
    margin?: 'none' | 'normal' | 'dense';
    sx?: SxProps;
    StackProps?: StackProps;
}

const PREFIX = 'RaTranslatableInputs';

export const TranslatableInputsClasses = {
    root: `${PREFIX}-root`,
    fullWidth: `${PREFIX}-fullWidth`,
};
const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    flexGrow: 1,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0.5),

    [`&.${TranslatableInputsClasses.fullWidth}`]: {
        width: '100%',
    },
}));
