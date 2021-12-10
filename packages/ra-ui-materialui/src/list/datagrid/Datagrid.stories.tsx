import * as React from 'react';
import {
    ResourceContextProvider,
    ListContextProvider,
    CoreAdminContext,
    testDataProvider,
    useRecordContext,
    useRecordSelection,
    useGetList,
} from 'ra-core';
import { Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { TextField } from '../../field';
import { BulkDeleteButton, BulkExportButton } from '../../button';
import { Datagrid } from './Datagrid';

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
                    value={{
                        data,
                        total: 4,
                        isLoading: false,
                        currentSort: { field: 'id', order: 'ASC' },
                        selectedIds,
                        onSelect: selectionModifiers.select,
                        onToggleItem: selectionModifiers.toggle,
                        onUnselectItems: selectionModifiers.clearSelection,
                    }}
                >
                    <Box sx={{ pt: 7, px: 4 }}>{children}</Box>
                </ListContextProvider>
            </ResourceContextProvider>
        </ThemeProvider>
    );
};

const Wrapper = ({ children }) => (
    <CoreAdminContext
        dataProvider={testDataProvider()}
        initialState={{
            admin: {
                resources: {
                    books: { list: { expanded: [], selectedIds: [] } },
                },
            },
        }}
    >
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
        <div>
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

const currentSort = { field: 'id', order: 'DESC' };

const MyCustomList = () => {
    const { data, total, isLoading } = useGetList('books', {
        pagination: { page: 1, perPage: 10 },
        sort: currentSort,
    });

    return (
        <Datagrid
            data={data}
            total={total}
            isLoading={isLoading}
            currentSort={currentSort}
            selectedIds={[]}
            setSort={() => {
                console.log('set sort');
            }}
            onSelect={() => {
                console.log('on select');
            }}
            onToggleItem={() => {
                console.log('on toggle item');
            }}
        >
            <TextField source="id" />
            <TextField source="title" />
        </Datagrid>
    );
};

export const Standalone = () => (
    <ThemeProvider theme={theme}>
        <CoreAdminContext
            dataProvider={testDataProvider({
                getList: () => Promise.resolve({ data, total: 4 }),
            })}
            initialState={{
                admin: {
                    resources: {
                        books: { list: { expanded: [], selectedIds: [] } },
                    },
                },
            }}
        >
            <MyCustomList />
        </CoreAdminContext>
    </ThemeProvider>
);
