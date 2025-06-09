import * as React from 'react';
import { screen, render, waitFor, fireEvent } from '@testing-library/react';
import expect from 'expect';
import {
    CoreAdminContext,
    testDataProvider,
    ListContextProvider,
} from 'ra-core';
import { createTheme, ThemeProvider, ThemeOptions } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';

import { BulkExportButton } from './BulkExportButton';

const theme = createTheme();

describe('<BulkExportButton />', () => {
    const exporter = jest.fn().mockName('exporter');
    const dataProvider = testDataProvider({
        getMany: jest.fn().mockResolvedValueOnce({ data: [], total: 0 }),
    });

    it('should invoke dataProvider with meta', async () => {
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ThemeProvider theme={theme}>
                    <ListContextProvider
                        value={{ selectedIds: ['selectedId'] }}
                    >
                        <BulkExportButton
                            resource="test"
                            exporter={exporter}
                            meta={{ pass: 'meta' }}
                        />
                    </ListContextProvider>
                </ThemeProvider>
            </CoreAdminContext>
        );

        fireEvent.click(screen.getByLabelText('ra.action.export'));

        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledWith('test', {
                ids: ['selectedId'],
                meta: { pass: 'meta' },
            });

            expect(exporter).toHaveBeenCalled();
        });
    });

    it('should be customized by a theme', () => {
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ThemeProvider
                    theme={deepmerge(theme, {
                        components: {
                            RaBulkExportButton: {
                                defaultProps: {
                                    label: 'Bulk Export',
                                    className: 'custom-class',
                                    'data-testid': 'themed-button',
                                },
                            },
                        },
                    } as ThemeOptions)}
                >
                    <ListContextProvider
                        value={{ selectedIds: ['selectedId'] }}
                    >
                        <BulkExportButton
                            resource="test"
                            exporter={exporter}
                            meta={{ pass: 'meta' }}
                        />
                    </ListContextProvider>
                </ThemeProvider>
            </CoreAdminContext>
        );

        const button = screen.getByTestId('themed-button');
        expect(button.textContent).toBe('Bulk Export');
        expect(button.classList).toContain('custom-class');
    });
});
