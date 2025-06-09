import * as React from 'react';
import { render, screen } from '@testing-library/react';
import expect from 'expect';
import { deepmerge } from '@mui/utils';
import { ThemeOptions } from '@mui/material';
import { ListContextProvider, testDataProvider } from 'ra-core';

import { AdminContext } from '../AdminContext';
import { defaultLightTheme } from '../theme';
import { BulkDeleteButton } from './BulkDeleteButton';

describe('<BulkDeleteButton />', () => {
    const dataProvider = testDataProvider({
        deleteMany: async () => ({ data: [{ id: 123 }] as any }),
    });

    it('should be customized by a theme', () => {
        render(
            <AdminContext
                dataProvider={dataProvider}
                theme={deepmerge(defaultLightTheme, {
                    components: {
                        RaBulkDeleteButton: {
                            defaultProps: {
                                label: 'Bulk Delete',
                                className: 'custom-class',
                                'data-testid': 'themed-button',
                            },
                        },
                    },
                } as ThemeOptions)}
            >
                <ListContextProvider
                    value={
                        {
                            selectedIds: [123],
                            onUnselectItems: () => {},
                        } as any
                    }
                >
                    <BulkDeleteButton
                        resource="books"
                        mutationMode="pessimistic"
                    />
                </ListContextProvider>
            </AdminContext>
        );

        const button = screen.getByTestId('themed-button');
        expect(button.textContent).toBe('Bulk Delete');
        expect(button.classList).toContain('custom-class');
    });
});
