import { useTranslate } from 'ra-core';

// DataTable requires a unique storeKey per page, so it doubles as a unique id prefix
export const getRowClickDescriptionId = (storeKey: string) =>
    `${storeKey}-row-click-description`;

/**
 * Describe the row click action to screen readers.
 * Functions and custom paths can't be resolved before the click, hence the generic 'Open'.
 */
export const useRowClickDescription = (rowClick: unknown) => {
    const translate = useTranslate();
    switch (rowClick) {
        case 'edit':
            return translate('ra.action.edit', { _: 'Edit' });
        case 'show':
            return translate('ra.action.show', { _: 'Show' });
        case 'expand':
            return translate('ra.action.expand', { _: 'Expand' });
        case 'toggleSelection':
            return translate('ra.action.select_row', {
                _: 'Select this row',
            });
        default:
            return translate('ra.action.open', { _: 'Open' });
    }
};
