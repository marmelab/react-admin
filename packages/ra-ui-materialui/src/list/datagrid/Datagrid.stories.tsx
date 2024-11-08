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
    TestMemoryRouter,
    SortPayload,
    AuthProvider,
} from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import defaultMessages from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import { Box, Checkbox, TableCell, TableRow, styled } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { FieldProps, TextField } from '../../field';
import { BulkDeleteButton, BulkExportButton } from '../../button';
import { Datagrid, DatagridProps } from './Datagrid';
import { ShowGuesser, SimpleShowLayout } from '../../detail';
import { AdminUI } from '../../AdminUI';
import { AdminContext } from '../../AdminContext';
import { List } from '../List';
import { EditGuesser } from '../../detail';
import { DatagridRowProps } from './DatagridRow';
import DatagridBody, { DatagridBodyProps } from './DatagridBody';

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
    const [selectedIds, selectionModifiers] = useRecordSelection({
        resource: 'books',
    });
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
            <i>{book?.title}</i>, by {book?.author} ({book?.year})
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

const sort = { field: 'id', order: 'DESC' } as SortPayload;

const MyCustomList = () => {
    const { data, total, isPending } = useGetList('books', {
        pagination: { page: 1, perPage: 10 },
        sort: sort,
    });

    return (
        <Datagrid
            data={data}
            total={total}
            isPending={isPending}
            sort={sort}
            bulkActionButtons={false}
        >
            <TextField source="id" />
            <TextField source="title" />
        </Datagrid>
    );
};

const MyCustomListInteractive = () => {
    const { data, isPending } = useGetList('books', {
        pagination: { page: 1, perPage: 10 },
        sort,
    });
    const listContext = useList({ data, isPending });

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
            <ResourceContextProvider value="books">
                <h1>Static</h1>
                <MyCustomList />
                <h1>Dynamic (with useList)</h1>
                <MyCustomListInteractive />
            </ResourceContextProvider>
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
    <TestMemoryRouter>
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
    </TestMemoryRouter>
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

const MyDatagridRow = ({
    onToggleItem,
    children,
    selected,
    selectable,
}: DatagridRowProps) => {
    const record = useRecordContext();
    return record ? (
        <TableRow
            sx={{
                '&:nth-of-type(odd)': {
                    backgroundColor: theme.palette.action.hover,
                },
                '&:last-child td, &:last-child th': {
                    border: 0,
                },
            }}
        >
            <TableCell padding="none">
                {selectable && (
                    <Checkbox
                        checked={selected}
                        onClick={event => {
                            if (onToggleItem) {
                                onToggleItem(record.id, event);
                            }
                        }}
                    />
                )}
            </TableCell>
            {React.Children.map(children, field =>
                React.isValidElement<FieldProps>(field) &&
                field.props.source ? (
                    <TableCell key={`${record.id}-${field.props.source}`}>
                        {field}
                    </TableCell>
                ) : null
            )}
        </TableRow>
    ) : null;
};

const MyDatagridBody = (props: DatagridBodyProps) => (
    <DatagridBody {...props} row={<MyDatagridRow />} />
);
const MyDatagrid = (props: DatagridProps) => (
    <Datagrid {...props} body={<MyDatagridBody />} />
);

export const CustomDatagridRow = () => (
    <Wrapper>
        <MyDatagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </MyDatagrid>
    </Wrapper>
);

export const LabelElements = () => (
    <TestMemoryRouter initialEntries={['/books']}>
        <AdminContext
            dataProvider={dataProvider}
            i18nProvider={polyglotI18nProvider(() => defaultMessages, 'en')}
        >
            <Resource
                name="books"
                list={
                    <List>
                        <Datagrid>
                            <TextField source="id" label={<span>ID</span>} />
                            <TextField
                                source="title"
                                label={<span>TITLE</span>}
                            />
                            <TextField
                                source="author"
                                label={<span>AUTHOR</span>}
                            />
                            <TextField
                                source="year"
                                label={<span>YEAR</span>}
                            />
                        </Datagrid>
                    </List>
                }
            />
        </AdminContext>
    </TestMemoryRouter>
);

export const AccessControl = ({
    allowedAction = 'show',
    authProvider = {
        login: () => Promise.reject(new Error('Not implemented')),
        logout: () => Promise.reject(new Error('Not implemented')),
        checkAuth: () => Promise.resolve(),
        checkError: () => Promise.reject(new Error('Not implemented')),
        getPermissions: () => Promise.resolve(undefined),
        canAccess: ({ action }) =>
            new Promise(resolve => {
                setTimeout(
                    resolve,
                    300,
                    action === 'list' ||
                        (allowedAction && action === allowedAction)
                );
            }),
    },
}: {
    allowedAction?: 'show' | 'edit' | 'invalid';
    authProvider?: AuthProvider;
}) => (
    <AdminContext
        authProvider={authProvider}
        dataProvider={dataProvider}
        i18nProvider={polyglotI18nProvider(() => defaultMessages, 'en')}
    >
        <AdminUI>
            <Resource
                name="books"
                list={() => (
                    <List>
                        <Datagrid key={allowedAction}>
                            <TextField source="id" />
                            <TextField source="title" />
                            <TextField source="author" />
                            <TextField source="year" />
                        </Datagrid>
                    </List>
                )}
                show={ShowGuesser}
                edit={EditGuesser}
            />
        </AdminUI>
    </AdminContext>
);

AccessControl.argTypes = {
    allowedAction: {
        options: ['show', 'edit', 'none'],
        mapping: {
            show: 'show',
            edit: 'edit',
            none: 'invalid',
        },
        control: { type: 'select' },
    },
};
