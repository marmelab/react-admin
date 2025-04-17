import * as React from 'react';
import fakerestDataProvider from 'ra-data-fakerest';
import { Resource } from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { AdminContext } from '../AdminContext';
import SortButton from './SortButton';
import { List, SimpleList } from '../list';
import { Box, Typography } from '@mui/material';

export default { title: 'ra-ui-materialui/button/SortButton' };

const data = {
    players: [
        { id: 1, firstName: 'Leo', lastName: 'Messi', position: 'RW' },
        { id: 2, firstName: 'Cristiano', lastName: 'Ronaldo', position: 'LW' },
        { id: 3, firstName: 'Robert', lastName: 'Lewandowski', position: 'ST' },
        { id: 4, firstName: 'Neymar', lastName: 'Jr', position: 'LW' },
        { id: 5, firstName: 'Kevin', lastName: 'De Bruyne', position: 'CAM' },
        { id: 6, firstName: 'Jan', lastName: 'Oblak', position: 'GK' },
        { id: 7, firstName: 'Virgil', lastName: 'Van Dijk', position: 'CB' },
        { id: 8, firstName: 'Kylian', lastName: 'Mbappe', position: 'ST' },
        { id: 9, firstName: 'Mohamed', lastName: 'Salah', position: 'RW' },
        { id: 10, firstName: 'Sadio', lastName: 'Mane', position: 'LW' },
    ],
};

const dataProvider = fakerestDataProvider(
    data,
    process.env.NODE_ENV === 'development'
);

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const PlayerList = () => (
    <Box p={2} bgcolor="#fafafb">
        <Typography variant="h5">Players</Typography>
        <List
            exporter={false}
            sort={{ field: 'lastName', order: 'ASC' }}
            disableSyncWithLocation
            actions={
                <SortButton fields={['firstName', 'lastName', 'position']} />
            }
            sx={{ '& .RaList-actions': { minHeight: 0 } }}
        >
            <SimpleList
                primaryText={record => `${record.firstName} ${record.lastName}`}
                tertiaryText={record => record.position}
            />
        </List>
    </Box>
);

export const Basic = () => (
    <AdminContext dataProvider={dataProvider} defaultTheme="light">
        <Resource name="players" list={PlayerList} />
    </AdminContext>
);

export const I18N = () => (
    <AdminContext
        dataProvider={dataProvider}
        defaultTheme="light"
        i18nProvider={i18nProvider}
    >
        <Resource name="players" list={PlayerList} />
    </AdminContext>
);

const PlayerListSX = () => (
    <List
        exporter={false}
        sort={{ field: 'lastName', order: 'ASC' }}
        disableSyncWithLocation
        actions={
            <SortButton
                fields={['firstName', 'lastName', 'position']}
                sx={{
                    mx: 4,
                    border: '1px solid red',
                    p: 1,
                    '& .MuiButton-root': {
                        color: 'text.secondary',
                    },
                }}
            />
        }
    >
        <SimpleList
            primaryText={record => `${record.firstName} ${record.lastName}`}
            tertiaryText={record => record.position}
        />
    </List>
);

export const SX = () => (
    <AdminContext dataProvider={dataProvider} defaultTheme="light">
        <Resource name="players" list={PlayerListSX} />
    </AdminContext>
);
