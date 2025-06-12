import * as React from 'react';
import { screen, render, waitFor, fireEvent } from '@testing-library/react';
import expect from 'expect';
import {
    CoreAdminContext,
    testDataProvider,
    ListContextProvider,
} from 'ra-core';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { BulkExportButton } from './BulkExportButton';
import { Themed } from './BulkExportButton.stories';

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

    it('should be customized by a theme', async () => {
        render(<Themed />);

        const button = await screen.findByTestId('themed');
        expect(button.textContent).toBe('Bulk Export');
        expect(button.classList).toContain('custom-class');
    });
});
