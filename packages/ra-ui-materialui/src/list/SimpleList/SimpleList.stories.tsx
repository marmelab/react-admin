import * as React from 'react';
import { useState } from 'react';
import fakeRestDataProvider from 'ra-data-fakerest';
import {
    Resource,
    ListContextProvider,
    TestMemoryRouter,
    ResourceContextProvider,
    ResourceProps,
    ResourceDefinitionContextProvider,
} from 'ra-core';
import defaultMessages from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import { Alert, Box, FormControlLabel, FormGroup, Switch } from '@mui/material';
import { Location } from 'react-router';

import { AdminUI } from '../../AdminUI';
import { AdminContext, AdminContextProps } from '../../AdminContext';
import { EditGuesser } from '../../detail';
import { List, ListProps } from '../List';
import { RowClickFunction } from '../types';
import { SimpleList } from './SimpleList';
import { FunctionLinkType } from './SimpleListItem';

export default { title: 'ra-ui-materialui/list/SimpleList' };

const data = {
    books: [
        {
            id: 1,
            title: 'War and Peace',
            author: 'Leo Tolstoy',
            year: 1869,
        },
        {
            id: 2,
            title: 'Pride and Predjudice',
            author: 'Jane Austen',
            year: 1813,
        },
        {
            id: 3,
            title: 'The Picture of Dorian Gray',
            author: 'Oscar Wilde',
            year: 1890,
        },
        {
            id: 4,
            title: 'Le Petit Prince',
            author: 'Antoine de Saint-Exupéry',
            year: 1943,
        },
        {
            id: 5,
            title: "Alice's Adventures in Wonderland",
            author: 'Lewis Carroll',
            year: 1865,
        },
        {
            id: 6,
            title: 'Madame Bovary',
            author: 'Gustave Flaubert',
            year: 1856,
        },
        {
            id: 7,
            title: 'The Lord of the Rings',
            author: 'J. R. R. Tolkien',
            year: 1954,
        },
        {
            id: 8,
            title: "Harry Potter and the Philosopher's Stone",
            author: 'J. K. Rowling',
            year: 1997,
        },
        {
            id: 9,
            title: 'The Alchemist',
            author: 'Paulo Coelho',
            year: 1988,
        },
        {
            id: 10,
            title: 'A Catcher in the Rye',
            author: 'J. D. Salinger',
            year: 1951,
        },
        {
            id: 11,
            title: 'Ulysses',
            author: 'James Joyce',
            year: 1922,
        },
        {
            id: 12,
            title: 'One Hundred Years of Solitude',
            author: 'Gabriel García Márquez',
            year: 1967,
        },
        {
            id: 13,
            title: 'Snow Country',
            author: 'Yasunari Kawabata',
            year: 1956,
        },
    ],
};

export const Basic = () => (
    <TestMemoryRouter>
        <AdminContext>
            <ResourceContextProvider value="books">
                <SimpleList
                    data={data.books}
                    primaryText={record => record.title}
                    secondaryText={record => record.author}
                    tertiaryText={record => record.year}
                />
            </ResourceContextProvider>
        </AdminContext>
    </TestMemoryRouter>
);

export const LinkType = ({
    linkType,
    locationCallback,
}: {
    linkType: string | FunctionLinkType | false;
    locationCallback?: (l: Location) => void;
}) => (
    <TestMemoryRouter locationCallback={locationCallback}>
        <AdminContext>
            <ResourceDefinitionContextProvider
                definitions={{
                    books: {
                        name: 'books',
                        hasList: true,
                        hasEdit: true,
                        hasShow: false,
                    },
                }}
            >
                <ResourceContextProvider value="books">
                    <Alert color="info">Inferred should target edit</Alert>
                    <SimpleList
                        data={data.books}
                        primaryText={record => record.title}
                        secondaryText={record => record.author}
                        tertiaryText={record => record.year}
                        linkType={linkType}
                    />
                </ResourceContextProvider>
            </ResourceDefinitionContextProvider>
        </AdminContext>
    </TestMemoryRouter>
);

LinkType.args = {
    linkType: 'edit',
};
LinkType.argTypes = {
    linkType: {
        options: ['inferred', 'edit', 'show', 'no-link', 'function'],
        mapping: {
            inferred: undefined,
            show: 'show',
            edit: 'edit',
            'no-link': false,
            function: (record, id) =>
                alert(`Clicked on record ${record.title} (#${id})`),
        },
        control: { type: 'select' },
    },
};

export const RowClick = ({
    locationCallback,
    rowClick,
}: {
    locationCallback?: (l: Location) => void;
    rowClick: string | RowClickFunction | false;
}) => (
    <TestMemoryRouter locationCallback={locationCallback}>
        <AdminContext>
            <ResourceDefinitionContextProvider
                definitions={{
                    books: {
                        name: 'books',
                        hasList: true,
                        hasEdit: true,
                        hasShow: false,
                    },
                }}
            >
                <ResourceContextProvider value="books">
                    <Alert color="info">Inferred should target edit</Alert>
                    <SimpleList
                        data={data.books}
                        primaryText={record => record.title}
                        secondaryText={record => record.author}
                        tertiaryText={record => record.year}
                        rowClick={rowClick}
                    />
                </ResourceContextProvider>
            </ResourceDefinitionContextProvider>
        </AdminContext>
    </TestMemoryRouter>
);

RowClick.args = {
    rowClick: 'edit',
};
RowClick.argTypes = {
    rowClick: {
        options: ['inferred', 'edit', 'show', 'no-link', 'function'],
        mapping: {
            inferred: undefined,
            show: 'show',
            edit: 'edit',
            'no-link': false,
            function: (id, resource, record) =>
                alert(
                    `Clicked on record ${record.title} (#${id}) of type ${resource}`
                ),
        },
        control: { type: 'select' },
    },
};

const myDataProvider = fakeRestDataProvider(data);

const Wrapper = ({
    children,
    dataProvider = myDataProvider,
    recordRepresentation,
}: {
    children: ListProps['children'];
    dataProvider?: AdminContextProps['dataProvider'];
    recordRepresentation?: ResourceProps['recordRepresentation'];
}) => (
    <AdminContext
        dataProvider={dataProvider}
        i18nProvider={polyglotI18nProvider(() => defaultMessages, 'en')}
    >
        <AdminUI>
            <Resource
                name="books"
                recordRepresentation={recordRepresentation}
                list={() => <List>{children}</List>}
                edit={EditGuesser}
            />
        </AdminUI>
    </AdminContext>
);

export const FullApp = () => (
    <Wrapper>
        <SimpleList
            primaryText={record => record.title}
            secondaryText={record => record.author}
        />
    </Wrapper>
);

export const IconsAvatarsAndLinkType = () => {
    const [linkType, setLinkType] = useState<false | undefined>(undefined);
    const [leftIcon, setLeftIcon] = useState(true);
    const [leftAvatar, setLeftAvatar] = useState(true);
    const [rightIcon, setRightIcon] = useState(true);
    const [rightAvatar, setRightAvatar] = useState(true);
    return (
        <Wrapper>
            <FormGroup
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <Box>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={leftIcon}
                                onChange={() => setLeftIcon(!leftIcon)}
                            />
                        }
                        label="Left Icon"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={leftAvatar}
                                onChange={() => setLeftAvatar(!leftAvatar)}
                            />
                        }
                        label="Left Avatar"
                    />
                </Box>
                <FormControlLabel
                    control={
                        <Switch
                            checked={linkType !== false}
                            onChange={() =>
                                setLinkType(
                                    linkType === false ? undefined : false
                                )
                            }
                        />
                    }
                    label="LinkType"
                />
                <Box>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={rightAvatar}
                                onChange={() => setRightAvatar(!rightAvatar)}
                            />
                        }
                        label="Right Avatar"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={rightIcon}
                                onChange={() => setRightIcon(!rightIcon)}
                            />
                        }
                        label="Right Icon"
                    />
                </Box>
            </FormGroup>
            <SimpleList
                primaryText={record => record.title}
                secondaryText={record => record.author}
                linkType={linkType}
                leftIcon={
                    leftIcon ? record => <span>{record.id}</span> : undefined
                }
                rightIcon={
                    rightIcon ? record => <span>{record.year}</span> : undefined
                }
                leftAvatar={
                    leftAvatar
                        ? record => <span>{record.title[0]}</span>
                        : undefined
                }
                rightAvatar={
                    rightAvatar
                        ? record => <span>{record.author[0]}</span>
                        : undefined
                }
            />
        </Wrapper>
    );
};

export const NoPrimaryText = () => (
    <Wrapper recordRepresentation="title">
        <SimpleList />
    </Wrapper>
);

export const ErrorInFetch = () => (
    <TestMemoryRouter>
        <ResourceContextProvider value="books">
            <ListContextProvider
                value={
                    {
                        error: new Error('Error in dataProvider'),
                    } as any
                }
            >
                <SimpleList
                    primaryText={record => record.title}
                    secondaryText={record => record.author}
                    tertiaryText={record => record.year}
                />
            </ListContextProvider>
        </ResourceContextProvider>
    </TestMemoryRouter>
);

export const FullAppInError = () => (
    <Wrapper
        dataProvider={
            {
                getList: () =>
                    Promise.reject(new Error('Error in dataProvider')),
            } as any
        }
    >
        <SimpleList
            primaryText={record => record.title}
            secondaryText={record => record.author}
        />
    </Wrapper>
);

export const Standalone = () => (
    <TestMemoryRouter>
        <AdminContext>
            <ResourceContextProvider value="books">
                <SimpleList
                    data={data.books}
                    primaryText={record => record.title}
                    secondaryText={record => record.author}
                    tertiaryText={record => record.year}
                    linkType={false}
                />
            </ResourceContextProvider>
        </AdminContext>
    </TestMemoryRouter>
);

export const StandaloneEmpty = () => (
    <TestMemoryRouter>
        <AdminContext>
            <ResourceContextProvider value="books">
                <SimpleList<any>
                    data={[]}
                    primaryText={record => record.title}
                    secondaryText={record => record.author}
                    tertiaryText={record => record.year}
                    linkType={false}
                />
            </ResourceContextProvider>
        </AdminContext>
    </TestMemoryRouter>
);
