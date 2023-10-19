import * as React from 'react';
import {
    Resource,
    ResourceContextProvider,
    ListContextProvider,
    CoreAdminContext,
    testDataProvider,
    useRecordContext,
    useRecordSelection,
    useGetList,
    useList,
} from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import defaultMessages from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import { Box, styled } from '@mui/material';
import { MemoryRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { TextField } from '../../field';
import { BulkDeleteButton, BulkExportButton } from '../../button';
import { Datagrid } from './Datagrid';
import { SimpleShowLayout } from '../../detail';
import { AdminUI } from '../../AdminUI';
import { AdminContext } from '../../AdminContext';
import { List } from '../List';
import { EditGuesser } from '../../detail';

export default { title: 'ra-ui-materialui/list/Datagrid' };

const data = [
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
];

const theme = createTheme();

const SubWrapper = ({ children }) => {
    const [selectedIds, selectionModifiers] = useRecordSelection('books');
    return (
        <ThemeProvider theme={theme}>
            <ResourceContextProvider value="books">
                <ListContextProvider
                    value={
                        {
                            data,
                            total: 4,
                            isLoading: false,
                            sort: { field: 'id', order: 'ASC' },
                            selectedIds,
                            onSelect: selectionModifiers.select,
                            onToggleItem: selectionModifiers.toggle,
                            onUnselectItems: selectionModifiers.clearSelection,
                        } as any
                    }
                >
                    <Box sx={{ pt: 7, px: 4 }}>{children}</Box>
                </ListContextProvider>
            </ResourceContextProvider>
        </ThemeProvider>
    );
};

const Wrapper = ({ children }) => (
    <CoreAdminContext>
        <SubWrapper>{children}</SubWrapper>
    </CoreAdminContext>
);

export const Basic = () => (
    <Wrapper>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </Wrapper>
);

const ExpandPanel = () => {
    const book = useRecordContext();
    return (
        <div data-testid="ExpandPanel">
            <i>{book.title}</i>, by {book.author} ({book.year})
        </div>
    );
};

export const Expand = () => (
    <Wrapper>
        <Datagrid expand={<ExpandPanel />}>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </Wrapper>
);

export const ExpandSingle = () => (
    <Wrapper>
        <Datagrid expand={<ExpandPanel />} expandSingle>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </Wrapper>
);

export const Hover = () => (
    <Wrapper>
        <Datagrid hover={false}>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </Wrapper>
);

export const RowStyle = () => (
    <Wrapper>
        <Datagrid
            rowStyle={(record: any) => ({
                backgroundColor: record.id % 2 ? 'white' : '#eee',
            })}
        >
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </Wrapper>
);

export const RowSx = () => (
    <Wrapper>
        <Datagrid
            rowSx={(record: any) => ({
                backgroundColor: record.id % 2 ? 'white' : '#eee',
                ...(record.year > 1900 && {
                    '& td.column-year': { color: 'primary.main' },
                }),
            })}
        >
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </Wrapper>
);

const CutomBulkActionButtons = () => (
    <>
        <BulkExportButton />
        <BulkDeleteButton />
    </>
);

export const BulkActionButtons = () => (
    <Wrapper>
        <Box sx={{ mt: -7 }}>
            <h1>Default</h1>
            <Datagrid>
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="author" />
                <TextField source="year" />
            </Datagrid>
            <h1>Disabled</h1>
            <Datagrid bulkActionButtons={false}>
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="author" />
                <TextField source="year" />
            </Datagrid>
            <h1>Custom</h1>
            <Datagrid bulkActionButtons={<CutomBulkActionButtons />}>
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="author" />
                <TextField source="year" />
            </Datagrid>
            <h1>Unselectable Rows</h1>
            <Datagrid isRowSelectable={record => record.id % 2 === 0}>
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="author" />
                <TextField source="year" />
            </Datagrid>
        </Box>
    </Wrapper>
);

const CustomEmpty = () => <div>No books found</div>;

export const Empty = () => (
    <Wrapper>
        <Box sx={{ mt: -7 }}>
            <h1>Default</h1>
            <Datagrid data={[]} total={0}>
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="author" />
                <TextField source="year" />
            </Datagrid>
            <h1>Custom</h1>
            <Datagrid data={[]} total={0} empty={<CustomEmpty />}>
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="author" />
                <TextField source="year" />
            </Datagrid>
        </Box>
    </Wrapper>
);

export const Size = () => (
    <Wrapper>
        <Box sx={{ mt: -7 }}>
            <h1>Default (small)</h1>
            <Datagrid>
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="author" />
                <TextField source="year" />
            </Datagrid>
            <h1>Medium</h1>
            <Datagrid size="medium">
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="author" />
                <TextField source="year" />
            </Datagrid>
        </Box>
    </Wrapper>
);

export const SX = () => (
    <Wrapper>
        <Datagrid
            sx={{
                '& .RaDatagrid-rowOdd': {
                    backgroundColor: '#fee',
                },
            }}
        >
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </Wrapper>
);

export const ColumnStyles = () => (
    <Wrapper>
        <Box sx={{ mt: -7 }}>
            <h1>Full column</h1>
            <Datagrid
                sx={{
                    '& .column-title': {
                        backgroundColor: '#fee',
                    },
                }}
            >
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="author" />
                <TextField source="year" />
            </Datagrid>
            <h1>Cells only</h1>
            <Datagrid
                sx={{
                    '& td.column-title': {
                        backgroundColor: '#fee',
                    },
                }}
            >
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="author" />
                <TextField source="year" />
            </Datagrid>
            <h1>Hidden column on small screens</h1>
            <Datagrid
                sx={{
                    '& .column-title': {
                        sm: { display: 'none' },
                        md: { display: 'table-cell' },
                    },
                }}
            >
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="author" />
                <TextField source="year" />
            </Datagrid>
        </Box>
    </Wrapper>
);

const sort = { field: 'id', order: 'DESC' };

const MyCustomList = () => {
    const { data, total, isLoading } = useGetList('books', {
        pagination: { page: 1, perPage: 10 },
        sort: sort,
    });

    return (
        <Datagrid
            data={data}
            total={total}
            isLoading={isLoading}
            sort={sort}
            bulkActionButtons={false}
        >
            <TextField source="id" />
            <TextField source="title" />
        </Datagrid>
    );
};

const MyCustomListInteractive = () => {
    const { data, isLoading } = useGetList('books', {
        pagination: { page: 1, perPage: 10 },
        sort,
    });
    const listContext = useList({ data, isLoading });

    return (
        <ListContextProvider value={listContext}>
            <Datagrid>
                <TextField source="id" />
                <TextField source="title" />
            </Datagrid>
        </ListContextProvider>
    );
};

export const Standalone = () => (
    <ThemeProvider theme={theme}>
        <CoreAdminContext
            dataProvider={testDataProvider({
                getList: () => Promise.resolve({ data, total: 4 }) as any,
            })}
        >
            <h1>Static</h1>
            <MyCustomList />
            <h1>Dynamic (with useList)</h1>
            <MyCustomListInteractive />
        </CoreAdminContext>
    </ThemeProvider>
);

export const IsRowSelectable = () => (
    <Wrapper>
        <Datagrid isRowSelectable={record => Boolean(record.id % 2)}>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </Wrapper>
);

export const IsRowExpandable = () => (
    <Wrapper>
        <Datagrid
            isRowExpandable={record => Boolean(record.id % 2)}
            expand={
                <SimpleShowLayout>
                    <TextField source="id" />
                    <TextField source="title" />
                    <TextField source="author" />
                    <TextField source="year" />
                </SimpleShowLayout>
            }
        >
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </Wrapper>
);

const StyledDatagrid = styled(Datagrid, {
    name: 'MyStyledDatagrid',
    overridesResolver: (props, styles) => styles.root,
})(() => ({
    width: '70%',
    backgroundColor: '#ffb',
}));

export const StyledComponent = () => (
    <Wrapper>
        <StyledDatagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </StyledDatagrid>
    </Wrapper>
);

export const ErrorInFetch = () => (
    <MemoryRouter>
        <ListContextProvider
            value={
                {
                    error: new Error('Error in dataProvider'),
                } as any
            }
        >
            <Datagrid>
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="author" />
                <TextField source="year" />
            </Datagrid>
        </ListContextProvider>
    </MemoryRouter>
);

export const RowClickFalse = () => (
    <Wrapper>
        <Datagrid rowClick={false}>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </Wrapper>
);

const dataProvider = fakeRestDataProvider({ books: data });

export const FullApp = () => (
    <AdminContext
        dataProvider={dataProvider}
        i18nProvider={polyglotI18nProvider(() => defaultMessages, 'en')}
    >
        <AdminUI>
            <Resource
                name="books"
                list={() => (
                    <List>
                        <Datagrid>
                            <TextField source="id" />
                            <TextField source="title" />
                            <TextField source="author" />
                            <TextField source="year" />
                        </Datagrid>
                    </List>
                )}
                edit={EditGuesser}
            />
        </AdminUI>
    </AdminContext>
);
