import * as React from 'react';
import {
    ListContextProvider,
    ResourceContextProvider,
    ResourceDefinitionContextProvider,
    useList,
} from 'ra-core';
import { MemoryRouter } from 'react-router-dom';
import { Typography, Divider as MuiDivider } from '@mui/material';

import { SingleFieldList } from './SingleFieldList';
import { ChipField } from '../field/ChipField';
import { TextField } from '../field/TextField';

const bookGenres = [
    { id: 0, name: 'Fiction' },
    { id: 1, name: 'Science-fiction' },
    { id: 2, name: 'Horror' },
    { id: 3, name: 'Biography' },
    { id: 4, name: 'Historical' },
    { id: 5, name: 'Crime' },
    { id: 6, name: 'Romance' },
    { id: 7, name: 'Humor' },
];

export default {
    title: 'ra-ui-materialui/list/SingleFieldList',
};

const Wrapper = ({
    children,
    data = [bookGenres[2], bookGenres[4], bookGenres[1]],
}) => {
    const listContextValue = useList({
        data,
    });
    return (
        <MemoryRouter>
            <ResourceDefinitionContextProvider
                definitions={{
                    books: {
                        name: 'books',
                        hasList: true,
                        hasEdit: true,
                        hasShow: true,
                        hasCreate: true,
                        recordRepresentation: 'name',
                    },
                }}
            >
                <ResourceContextProvider value="books">
                    <ListContextProvider value={listContextValue}>
                        {children}
                    </ListContextProvider>
                </ResourceContextProvider>
            </ResourceDefinitionContextProvider>
        </MemoryRouter>
    );
};
const Title = ({ children }) => (
    <Typography ml={1} mt={2} mb={1}>
        {children}
    </Typography>
);

export const Basic = () => (
    <Wrapper>
        <SingleFieldList />
    </Wrapper>
);

export const Children = () => (
    <Wrapper>
        <Title>Text Field</Title>
        <SingleFieldList>
            <TextField
                source="name"
                sx={{
                    m: 1,
                    p: 0.5,
                    border: '1px solid grey',
                    borderRadius: 2,
                }}
            />
        </SingleFieldList>
        <Title>Chip Field</Title>
        <SingleFieldList>
            <ChipField source="name" />
        </SingleFieldList>
        <Title>Chip Field small</Title>
        <SingleFieldList>
            <ChipField source="name" size="small" />
        </SingleFieldList>
    </Wrapper>
);

export const LinkType = () => (
    <Wrapper>
        <Title>Default (Edit link)</Title>
        <SingleFieldList />
        <Title>Show link</Title>
        <SingleFieldList linkType="show" />
        <Title>No link</Title>
        <SingleFieldList linkType={false} />
    </Wrapper>
);

export const NoData = () => (
    <Wrapper data={[]}>
        <SingleFieldList />
    </Wrapper>
);

export const Empty = ({ listContext = { data: [] } }) => (
    <ListContextProvider value={listContext as any}>
        <SingleFieldList empty={<div>No genres</div>} />
    </ListContextProvider>
);

export const Loading = () => (
    <ListContextProvider value={{ isLoading: true } as any}>
        <SingleFieldList />
    </ListContextProvider>
);

export const Direction = () => (
    <Wrapper>
        <Title>Default (row)</Title>
        <SingleFieldList />
        <Title>Column</Title>
        <SingleFieldList direction="column" />
    </Wrapper>
);

export const Gap = () => (
    <Wrapper>
        <Title>No gap</Title>
        <SingleFieldList gap={0} />
        <Title>Default (1)</Title>
        <SingleFieldList />
        <Title>Custom gap</Title>
        <SingleFieldList gap={2} />
    </Wrapper>
);

export const Divider = () => (
    <Wrapper>
        <SingleFieldList
            divider={<MuiDivider orientation="vertical" flexItem />}
        />
    </Wrapper>
);

export const Component = () => (
    <Wrapper>
        <SingleFieldList component="span" />
    </Wrapper>
);

export const SX = () => (
    <Wrapper>
        <SingleFieldList sx={{ border: '1px solid grey' }} />
    </Wrapper>
);

export const Controlled = () => (
    <Wrapper>
        <SingleFieldList
            data={[bookGenres[3], bookGenres[6], bookGenres[7], bookGenres[2]]}
            resource="book_genres"
        />
    </Wrapper>
);
