import * as React from 'react';
import { createTheme } from '@mui/material';
import { DeleteButton } from './DeleteButton';
import { AdminContext } from '../AdminContext';

export default { title: 'ra-ui-materialui/button/DeleteButton' };

export const Basic = () => (
    <AdminContext>
        <DeleteButton label="Delete" record={{ id: 1 }} />
    </AdminContext>
);

export const Pessimistic = () => (
    <AdminContext>
        <DeleteButton
            mutationMode="pessimistic"
            record={{ id: 1 }}
            label="Delete"
            resource="post"
        />
    </AdminContext>
);

export const WithUserDefinedPalette = () => (
    <AdminContext theme={theme}>
        <DeleteButton label="Delete" record={{ id: 1 }} />
    </AdminContext>
);

const theme = createTheme({
    palette: {
        error: {
            main: '#07BA8F',
        },
    },
});
