import * as React from 'react';
import CategoryIcon from '@mui/icons-material/LocalOffer';
import MailIcon from '@mui/icons-material/MailOutline';
import Person2Icon from '@mui/icons-material/Person2';
import TitleIcon from '@mui/icons-material/Title';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import {
    FilterLiveForm,
    FilterLiveFormProps,
    ListContextProvider,
    required,
    Resource,
    useList,
    useListContext,
} from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { FilterListSection } from '.';
import { AdminContext } from '../../AdminContext';
import { AdminUI } from '../../AdminUI';
import { ExportButton } from '../../button';
import { ReferenceField, TextField } from '../../field';
import { AutocompleteInput, ReferenceInput, TextInput } from '../../input';
import { TopToolbar } from '../../layout';
import { List } from '../List';
import { Datagrid } from '../datagrid/Datagrid';
import { FilterList } from './FilterList';
import { FilterListItem } from './FilterListItem';

export default { title: 'ra-ui-materialui/list/filter/FilterLiveForm' };

const i18nProvider = polyglotI18nProvider(
    () => englishMessages,
    'en' // Default locale
);

export const WithFilterListSection = () => {
    const listContext = useList({
        data: [
            { id: 1, title: 'Hello', has_newsletter: true },
            { id: 2, title: 'World', has_newsletter: false },
        ],
        filter: {
            category: 'deals',
        },
    });
    return (
        <ListContextProvider value={listContext}>
            <Card
                sx={{
                    width: '17em',
                    margin: '1em',
                }}
            >
                <CardContent>
                    <FilterList
                        label="Subscribed to newsletter"
                        icon={<MailIcon />}
                    >
                        <FilterListItem
                            label="Yes"
                            value={{ has_newsletter: true }}
                        />
                        <FilterListItem
                            label="No"
                            value={{ has_newsletter: false }}
                        />
                    </FilterList>
                    <FilterListSection label="Title" icon={<TitleIcon />}>
                        <FilterLiveForm>
                            <TextInput
                                source="title"
                                resettable
                                helperText={false}
                            />
                        </FilterLiveForm>
                    </FilterListSection>
                </CardContent>
            </Card>
            <FilterValue />
        </ListContextProvider>
    );
};

export const MultipleInput = () => {
    const listContext = useList({
        data: [
            { id: 1, title: 'Hello', has_newsletter: true },
            { id: 2, title: 'World', has_newsletter: false },
        ],
        filter: {
            category: 'deals',
        },
    });
    return (
        <ListContextProvider value={listContext}>
            <Card
                sx={{
                    width: '17em',
                    margin: '1em',
                }}
            >
                <CardContent>
                    <FilterList
                        label="Subscribed to newsletter"
                        icon={<MailIcon />}
                    >
                        <FilterListItem
                            label="Yes"
                            value={{ has_newsletter: true }}
                        />
                        <FilterListItem
                            label="No"
                            value={{ has_newsletter: false }}
                        />
                    </FilterList>
                    <FilterListSection label="Title" icon={<TitleIcon />}>
                        <FilterLiveForm>
                            <TextInput
                                source="title"
                                resettable
                                helperText={false}
                                sx={{ mb: 2 }}
                            />
                            <TextInput
                                source="author"
                                resettable
                                helperText={false}
                            />
                        </FilterLiveForm>
                    </FilterListSection>
                </CardContent>
            </Card>
            <FilterValue />
        </ListContextProvider>
    );
};

export const MultipleFilterLiveForm = () => {
    const listContext = useList({
        data: [
            { id: 1, title: 'Hello', has_newsletter: true },
            { id: 2, title: 'World', has_newsletter: false },
        ],
        filter: {
            category: 'deals',
        },
    });
    return (
        <ListContextProvider value={listContext}>
            <Card
                sx={{
                    width: '17em',
                    margin: '1em',
                }}
            >
                <CardContent>
                    <FilterList
                        label="Subscribed to newsletter"
                        icon={<MailIcon />}
                    >
                        <FilterListItem
                            label="Yes"
                            value={{ has_newsletter: true }}
                        />
                        <FilterListItem
                            label="No"
                            value={{ has_newsletter: false }}
                        />
                    </FilterList>
                    <FilterListSection label="Title" icon={<TitleIcon />}>
                        <FilterLiveForm>
                            <TextInput
                                source="title"
                                resettable
                                helperText={false}
                            />
                        </FilterLiveForm>
                    </FilterListSection>
                    <FilterListSection label="Author" icon={<Person2Icon />}>
                        <FilterLiveForm>
                            <TextInput
                                source="author"
                                resettable
                                helperText={false}
                            />
                        </FilterLiveForm>
                    </FilterListSection>
                </CardContent>
            </Card>
            <FilterValue />
        </ListContextProvider>
    );
};

export const PerInputValidation = () => {
    const listContext = useList({
        data: [
            { id: 1, title: 'Hello', has_newsletter: true },
            { id: 2, title: 'World', has_newsletter: false },
        ],
        filter: {
            category: 'deals',
            author: 'Leo Tolstoy',
        },
    });
    return (
        <ListContextProvider value={listContext}>
            <Card
                sx={{
                    width: '17em',
                    margin: '1em',
                }}
            >
                <CardContent>
                    <FilterList
                        label="Subscribed to newsletter"
                        icon={<MailIcon />}
                    >
                        <FilterListItem
                            label="Yes"
                            value={{ has_newsletter: true }}
                        />
                        <FilterListItem
                            label="No"
                            value={{ has_newsletter: false }}
                        />
                    </FilterList>
                    <FilterListSection label="Title" icon={<TitleIcon />}>
                        <FilterLiveForm>
                            <TextInput source="title" resettable />
                            <TextInput
                                source="author"
                                validate={required()}
                                resettable
                            />
                        </FilterLiveForm>
                    </FilterListSection>
                </CardContent>
            </Card>
            <FilterValue />
        </ListContextProvider>
    );
};

const validateFilters = values => {
    const errors: any = {};
    if (!values.author) {
        errors.author = 'The author is required';
    }
    return errors;
};
export const GlobalValidation = () => {
    const listContext = useList({
        data: [
            { id: 1, title: 'Hello', has_newsletter: true },
            { id: 2, title: 'World', has_newsletter: false },
        ],
        filter: {
            category: 'deals',
            author: 'Leo Tolstoy',
        },
    });
    return (
        <ListContextProvider value={listContext}>
            <Card
                sx={{
                    width: '17em',
                    margin: '1em',
                }}
            >
                <CardContent>
                    <FilterList
                        label="Subscribed to newsletter"
                        icon={<MailIcon />}
                    >
                        <FilterListItem
                            label="Yes"
                            value={{ has_newsletter: true }}
                        />
                        <FilterListItem
                            label="No"
                            value={{ has_newsletter: false }}
                        />
                    </FilterList>
                    <FilterListSection label="Title" icon={<TitleIcon />}>
                        <FilterLiveForm validate={validateFilters}>
                            <TextInput source="title" resettable />
                            <TextInput source="author" isRequired resettable />
                        </FilterLiveForm>
                    </FilterListSection>
                </CardContent>
            </Card>
            <FilterValue />
        </ListContextProvider>
    );
};

const FilterValue = () => {
    const { filterValues } = useListContext();
    return (
        <Box sx={{ margin: '1em' }}>
            <Typography>Filter values:</Typography>
            <pre>{JSON.stringify(filterValues, null, 2)}</pre>
            <pre style={{ display: 'none' }} data-testid="filter-values">
                {JSON.stringify(filterValues)}
            </pre>
        </Box>
    );
};

const dataProvider = fakeRestDataProvider({
    books: [
        {
            id: 1,
            title: 'War and Peace',
            authorId: 1,
            year: 1869,
        },
        {
            id: 2,
            title: 'Anna Karenina',
            authorId: 1,
            year: 1877,
        },
        {
            id: 3,
            title: 'Pride and Predjudice',
            authorId: 2,
            year: 1813,
        },
        {
            id: 4,
            authorId: 2,
            title: 'Sense and Sensibility',
            year: 1811,
        },
        {
            id: 5,
            title: 'The Picture of Dorian Gray',
            authorId: 3,
            year: 1890,
        },
        {
            id: 6,
            title: 'Le Petit Prince',
            authorId: 4,
            year: 1943,
        },
        {
            id: 7,
            title: "Alice's Adventures in Wonderland",
            authorId: 5,
            year: 1865,
        },
        {
            id: 8,
            title: 'Madame Bovary',
            authorId: 6,
            year: 1856,
        },
        { id: 9, title: 'The Hobbit', authorId: 7, year: 1937 },
        {
            id: 10,
            title: 'The Lord of the Rings',
            authorId: 7,
            year: 1954,
        },
        {
            id: 11,
            title: "Harry Potter and the Philosopher's Stone",
            authorId: 8,
            year: 1997,
        },
        {
            id: 12,
            title: 'The Alchemist',
            authorId: 9,
            year: 1988,
        },
        {
            id: 13,
            title: 'A Catcher in the Rye',
            authorId: 10,
            year: 1951,
        },
        {
            id: 14,
            title: 'Ulysses',
            authorId: 11,
            year: 1922,
        },
    ],
    authors: [
        { id: 1, firstName: 'Leo', lastName: 'Tolstoy' },
        { id: 2, firstName: 'Jane', lastName: 'Austen' },
        { id: 3, firstName: 'Oscar', lastName: 'Wilde' },
        { id: 4, firstName: 'Antoine', lastName: 'de Saint-Exupéry' },
        { id: 5, firstName: 'Lewis', lastName: 'Carroll' },
        { id: 6, firstName: 'Gustave', lastName: 'Flaubert' },
        { id: 7, firstName: 'J. R. R.', lastName: 'Tolkien' },
        { id: 8, firstName: 'J. K.', lastName: 'Rowling' },
        { id: 9, firstName: 'Paulo', lastName: 'Coelho' },
        { id: 10, firstName: 'J. D.', lastName: 'Salinger' },
        { id: 11, firstName: 'James', lastName: 'Joyce' },
    ],
});

const BookListAside = () => (
    <Card sx={{ order: -1, mr: 2, mt: 6, width: 250, height: 'fit-content' }}>
        <CardContent>
            <FilterList label="Century" icon={<CategoryIcon />}>
                <FilterListItem
                    label="21st"
                    value={{ year_gte: 2000, year_lte: undefined }}
                />
                <FilterListItem
                    label="20th"
                    value={{ year_gte: 1900, year_lte: 1999 }}
                />
                <FilterListItem
                    label="19th"
                    value={{ year_gte: 1800, year_lte: 1899 }}
                />
            </FilterList>
            <FilterListSection label="Title" icon={<TitleIcon />}>
                <FilterLiveForm>
                    <TextInput source="title" resettable helperText={false} />
                </FilterLiveForm>
            </FilterListSection>
            <FilterListSection label="Author" icon={<Person2Icon />}>
                <FilterLiveForm>
                    <ReferenceInput source="authorId" reference="authors">
                        <AutocompleteInput helperText={false} />
                    </ReferenceInput>
                </FilterLiveForm>
            </FilterListSection>
        </CardContent>
    </Card>
);

const BookList = () => (
    <List aside={<BookListAside />}>
        <Datagrid>
            <TextField source="title" />
            <ReferenceField source="authorId" reference="authors" />
            <TextField source="year" />
        </Datagrid>
    </List>
);

export const FullApp = () => (
    <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
        <AdminUI>
            <Resource name="books" list={BookList} />
            <Resource
                name="authors"
                recordRepresentation={record =>
                    `${record.firstName} ${record.lastName}`
                }
            />
        </AdminUI>
    </AdminContext>
);

const ListActions = () => (
    <Box width="100%">
        <TopToolbar sx={{ justifyContent: 'space-between' }}>
            <FilterLiveForm>
                <Stack direction="row" spacing={2} useFlexGap>
                    <TextInput
                        source="title"
                        resettable
                        fullWidth={false}
                        helperText={false}
                    />
                    <ReferenceInput source="authorId" reference="authors">
                        <AutocompleteInput
                            sx={{ width: 260 }}
                            helperText={false}
                        />
                    </ReferenceInput>
                </Stack>
            </FilterLiveForm>
            <ExportButton />
        </TopToolbar>
    </Box>
);

const BookListWithActions = () => (
    <List actions={<ListActions />}>
        <Datagrid>
            <TextField source="title" />
            <ReferenceField source="authorId" reference="authors" />
            <TextField source="year" />
        </Datagrid>
    </List>
);

export const AsListActions = () => (
    <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
        <AdminUI>
            <Resource name="books" list={BookListWithActions} />
            <Resource
                name="authors"
                recordRepresentation={record =>
                    `${record.firstName} ${record.lastName}`
                }
            />
        </AdminUI>
    </AdminContext>
);

const format = (value: string): string => {
    if (!value) {
        return value;
    }
    return value.length <= 11 ? value : `${value.slice(0, 11)}...`;
};
const parse = input => {
    if (!input) {
        return input;
    }
    return input.replace(/\D/g, '');
};
export const ParseFormat = (props: Partial<FilterLiveFormProps>) => {
    const listContext = useList({
        data: [
            { id: 1, document: 'Hello', has_newsletter: true },
            { id: 2, document: 'World', has_newsletter: false },
        ],
        filter: {
            category: 'deals',
        },
    });
    return (
        <ListContextProvider value={listContext}>
            <FilterLiveForm {...props}>
                <TextInput
                    source="document"
                    parse={parse}
                    format={format}
                    resettable
                />
            </FilterLiveForm>
            <FilterValue />
        </ListContextProvider>
    );
};
