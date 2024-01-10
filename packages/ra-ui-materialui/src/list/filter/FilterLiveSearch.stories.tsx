import * as React from 'react';
import { useList, ListContextProvider, useListContext } from 'ra-core';
import {
    Box,
    List,
    ListItem,
    ListItemText,
    ThemeProvider,
    createTheme,
} from '@mui/material';

import { FilterLiveSearch } from './FilterLiveSearch';
import { defaultTheme } from '../../theme/defaultTheme';

export default {
    title: 'ra-ui-materialui/list/filter/FilterLiveSearch',
};

const countries = [
    { id: 1, name: 'Austria' },
    { id: 2, name: 'Belgium' },
    { id: 3, name: 'Bulgaria' },
    { id: 4, name: 'Croatia' },
    { id: 5, name: 'Republic of Cyprus' },
    { id: 6, name: 'Czech Republic' },
    { id: 7, name: 'Denmark' },
    { id: 8, name: 'Estonia' },
    { id: 9, name: 'Finland' },
    { id: 10, name: 'France' },
    { id: 11, name: 'Germany' },
    { id: 12, name: 'Greece' },
    { id: 13, name: 'Hungary' },
    { id: 14, name: 'Ireland' },
    { id: 15, name: 'Italy' },
    { id: 16, name: 'Latvia' },
    { id: 17, name: 'Lithuania' },
    { id: 18, name: 'Luxembourg' },
    { id: 19, name: 'Malta' },
    { id: 20, name: 'Netherlands' },
    { id: 21, name: 'Poland' },
    { id: 22, name: 'Portugal' },
    { id: 23, name: 'Romania' },
    { id: 24, name: 'Slovakia' },
    { id: 25, name: 'Slovenia' },
    { id: 26, name: 'Spain' },
    { id: 27, name: 'Sweden' },
];

const Wrapper = ({ children }) => (
    <ThemeProvider theme={createTheme(defaultTheme)}>
        <ListContextProvider value={useList({ data: countries })}>
            <Box m={2}>{children}</Box>
        </ListContextProvider>
    </ThemeProvider>
);

const CountryList = () => {
    const { data } = useListContext();
    return (
        <List>
            {data.map(record => (
                <ListItem key={record.id} disablePadding>
                    <ListItemText>{record.name}</ListItemText>
                </ListItem>
            ))}
        </List>
    );
};

export const Basic = () => (
    <Wrapper>
        <FilterLiveSearch source="q" />
        <CountryList />
    </Wrapper>
);

export const Label = () => (
    <Wrapper>
        <FilterLiveSearch source="q" label="search" />
        <CountryList />
    </Wrapper>
);

export const HiddenLabel = () => (
    <Wrapper>
        <FilterLiveSearch source="q" hiddenLabel />
        <CountryList />
    </Wrapper>
);

export const Variant = () => (
    <Wrapper>
        <FilterLiveSearch source="q" variant="outlined" />
        <CountryList />
    </Wrapper>
);

export const FullWidth = () => (
    <Wrapper>
        <FilterLiveSearch source="q" fullWidth />
        <CountryList />
    </Wrapper>
);

export const Sx = () => (
    <Wrapper>
        <FilterLiveSearch source="q" sx={{ width: 300 }} />
        <CountryList />
    </Wrapper>
);
