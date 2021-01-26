import { useContext } from 'react';
import {
    TranslatableContext,
    TranslatableContextValue,
} from './TranslatableContext';

/**
 * Gives access to the current TranslatableContext.
 *
 * @example
 * <TranslatableFields
 *     selector={<MyLanguageSelector />}
 *     locales={['en', 'fr']}
 * >
 *     <TextField source={getSource('title')} />
 * <TranslatableFields>
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
 */
export const useTranslatableContext = (): TranslatableContextValue => {
    const context = useContext(TranslatableContext);

    if (!context) {
        throw new Error(
            'useTranslatableContext must be used inside a TranslatableContextProvider'
        );
    }

    return context;
};
