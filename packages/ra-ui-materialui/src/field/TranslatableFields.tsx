import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import {
    TranslatableContextProvider,
    useTranslatable,
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
 * * @param props The component props
 * * @param {string} props.defaultLocale The locale selected by default. Default to 'en'.
 * * @param {string[]} props.locales An array of the possible locales in the form. For example [{ 'en', 'fr' }].
 * * @param {ReactElement} props.selector The element responsible for selecting a locale. Defaults to Material UI tabs.
 */
export const TranslatableFields = (
    props: TranslatableFieldsProps
): ReactElement => {
    const {
        defaultLocale = 'en',
        locales,
        selector = <TranslatableFieldsTabs />,
        children,
        record,
        resource,
        basePath,
    } = props;
    const context = useTranslatable({ defaultLocale, locales });
    const classes = useStyles(props);

    return (
        <div className={classes.root}>
            <TranslatableContextProvider value={context}>
                {selector}
                {locales.map(locale => (
                    <TranslatableFieldsTabContent
                        key={locale}
                        basePath={basePath}
                        locale={locale}
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
    children: ReactNode;
    classes?: ClassesOverride<typeof useStyles>;
    record: Record;
    resource: string;
    selector?: ReactElement;
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
    },
}));
