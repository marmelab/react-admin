import { useTranslate } from 'ra-core';

// DataTable requires a unique storeKey per page, so it doubles as a unique id prefix
export const getRowClickDescriptionId = (storeKey: string) =>
    `${storeKey}-row-click-description`;

/**
 * Hint read by screen readers after the content of a focused clickable row.
 * Functions and custom paths can't be resolved before the click, hence the generic 'open'.
 */
export const useRowClickDescription = (rowClick: unknown) => {
    const translate = useTranslate();
    switch (rowClick) {
        case 'edit':
            return translate('ra.navigation.row_click.edit', {
                _: 'Press Enter to edit',
            });
        case 'show':
            return translate('ra.navigation.row_click.show', {
                _: 'Press Enter to view',
            });
        case 'expand':
            return translate('ra.navigation.row_click.expand', {
                _: 'Press Enter to expand',
            });
        case 'toggleSelection':
            return translate('ra.navigation.row_click.toggle_selection', {
                _: 'Press Enter to select',
            });
        default:
            return translate('ra.navigation.row_click.open', {
                _: 'Press Enter to open',
            });
    }
};
