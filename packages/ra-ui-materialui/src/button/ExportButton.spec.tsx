import * as React from 'react';
import { screen, render, waitFor, fireEvent } from '@testing-library/react';
import expect from 'expect';
import { CoreAdminContext, testDataProvider } from 'ra-core';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ExportButton } from './ExportButton';

const theme = createTheme();

describe('<ExportButton />', () => {
    it('should invoke dataProvider with meta', async () => {
        const exporter = jest.fn().mockName('exporter');
        const dataProvider = testDataProvider({
            getList: jest.fn().mockResolvedValueOnce({ data: [], total: 0 }),
        });

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ThemeProvider theme={theme}>
                    <ExportButton
                        resource="test"
                        filterValues={{ filters: 'override' }}
                        exporter={exporter}
                        meta={{ pass: 'meta' }}
                    />
                </ThemeProvider>
            </CoreAdminContext>
        );

        fireEvent.click(screen.getByLabelText('ra.action.export'));

        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalledWith('test', {
                sort: null,
                filter: { filters: 'override' },
                pagination: { page: 1, perPage: 1000 },
                meta: { pass: 'meta' },
            });

            expect(exporter).toHaveBeenCalled();
        });
    });
});
