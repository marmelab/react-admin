import * as React from 'react';
import {
    fireEvent,
    render,
    screen,
    waitFor,
    within,
} from '@testing-library/react';
import expect from 'expect';
import {
    CoreAdminContext,
    ListBase,
    ResourceContextProvider,
    testDataProvider,
} from 'ra-core';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { BulkUpdateWithConfirmButton } from './BulkUpdateWithConfirmButton';
import { Datagrid } from '../list';
import { TextField } from '../field';

const theme = createTheme();

describe('<BulkUpdateWithConfirmButton />', () => {
    it('should close the confirmation dialog after confirm', async () => {
        const record = { id: 123, title: 'lorem' };
        const dataProvider = testDataProvider({
            getList: () => Promise.resolve({ data: [record], total: 1 }),
            getMany: () => Promise.resolve({ data: [record] }),
            getOne: () => Promise.resolve({ data: record }),
            updateMany: p => {
                record.title = p.data.title;
                return p.ids;
            },
        });
        const ActionButtons = () => (
            <>
                <BulkUpdateWithConfirmButton
                    data={{ views: 'foobar' }}
                    mutationMode="pessimistic"
                />
            </>
        );
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <ResourceContextProvider value="posts">
                        <ListBase value={{ selectedIds: [123] }}>
                            <Datagrid bulkActionButtons={<ActionButtons />}>
                                <TextField source="title" />
                            </Datagrid>
                        </ListBase>
                    </ResourceContextProvider>
                </CoreAdminContext>
            </ThemeProvider>
        );
        expect(await screen.findByText('lorem')).toBeDefined();
        const checkContainer = screen.getAllByRole('columnheader')[0];
        const check = within(checkContainer).getByRole('checkbox');
        fireEvent.click(check);

        fireEvent.click(screen.getByLabelText('ra.action.update'));
        screen.debug(undefined, Infinity);
        expect(await screen.findByText('ra.message.bulk_update_title')).toBeDefined();
        fireEvent.click(screen.getByText('ra.action.confirm'));

        await waitFor(() => {
            expect(screen.queryByText('ra.message.bulk_update_title')).toBeNull();
        });
        expect(screen.getByText('foobar')).toBeDefined();
    });
});
