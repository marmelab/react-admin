import * as React from 'react';
import fakeRestDataProvider from 'ra-data-fakerest';
import {
    CanAccess,
    ListContextProvider,
    memoryStore,
    Resource,
    ResourceContextProvider,
    TestMemoryRouter,
    useDataTableDataContext,
    useRecordContext,
    useGetList,
    useList,
    type AuthProvider,
} from 'ra-core';
import defaultMessages from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import { createTheme } from '@mui/material/styles';
import {
    Box,
    TableCell,
    TableFooter,
    TableHead,
    TableRow,
    styled,
} from '@mui/material';

import { NumberField, ReferenceField, TextField } from '../../field';
import { List } from '../List';
import { DataTable, type DataTableProps } from './DataTable';
import { type DataTableRowProps } from './DataTableRow';
import {
    DataTableBody as BaseDataTableBody,
    type DataTableBodyProps,
} from './DataTableBody';
import {
    BulkDeleteButton,
    BulkExportButton,
    CreateButton,
    EditButton,
    SelectAllButton as RaSelectAllButton,
} from '../../button';
import { ShowGuesser, SimpleShowLayout, EditGuesser } from '../../detail';
import { AdminUI } from '../../AdminUI';
import { AdminContext } from '../../AdminContext';
import { BulkActionsToolbar } from '../BulkActionsToolbar';
import { SelectRowCheckbox } from './SelectRowCheckbox';
import { SelectPageCheckbox } from './SelectPageCheckbox';
import { TopToolbar } from '../../layout';
import { ColumnsButton } from './ColumnsButton';
import { type DataTableHeadProps } from './DataTableHead';

export default { title: 'ra-ui-materialui/list/DataTable' };

const data = {
    books: [
        {
            id: 1,
            title: 'War and Peace',
            author: { name: 'Leo Tolstoy' },
            year: 1869,
        },
        {
            id: 2,
            title: 'Pride and Prejudice',
            author: { name: 'Jane Austen' },
            year: 1813,
        },
        {
            id: 3,
            title: 'The Picture of Dorian Gray',
            author: { name: 'Oscar Wilde' },
            year: 1890,
        },
        {
            id: 4,
            title: 'Le Petit Prince',
            author: { name: 'Antoine de Saint-Exupéry' },
            year: 1943,
        },
        {
            id: 5,
            title: 'The Alchemist',
            author: { name: 'Paulo Coelho' },
            year: 1988,
        },
        {
            id: 6,
            title: 'Madame Bovary',
            author: { name: 'Gustave Flaubert' },
            year: 1857,
        },
        {
            id: 7,
            title: 'The Lord of the Rings',
            author: { name: 'J. R. R. Tolkien' },
            year: 1954,
        },
    ],
};

const dataProvider = fakeRestDataProvider(data);
const theme = createTheme();

const Wrapper = ({
    children,
    defaultDataProvider = dataProvider,
    i18nProvider = undefined,
    resource = 'books',
    actions = null,
    aside = null,
}) => (
    <TestMemoryRouter>
        <AdminContext
            dataProvider={defaultDataProvider}
            theme={theme}
            i18nProvider={i18nProvider}
            store={memoryStore()}
        >
            <ResourceContextProvider value={resource}>
                <List
                    perPage={5}
                    sx={{ p: 4 }}
                    actions={actions}
                    aside={aside}
                    sort={{ field: 'id', order: 'ASC' }}
                >
                    {children}
                </List>
            </ResourceContextProvider>
        </AdminContext>
    </TestMemoryRouter>
);

export const Basic = () => (
    <Wrapper i18nProvider={polyglotI18nProvider(() => defaultMessages, 'en')}>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col label="Author" source="author.name" />
            <DataTable.Col source="year" />
        </DataTable>
    </Wrapper>
);

export const Columns = () => (
    <Wrapper>
        <DataTable
            rowSx={record => (record.id === 6 ? { bgcolor: 'lightgray' } : {})}
        >
            <DataTable.Col source="id" label="Id" />
            <DataTable.Col
                source="title"
                render={record => record.title.toUpperCase()}
            />
            <DataTable.Col
                source="author.name"
                sx={{
                    color: 'darkgray',
                    '&.MuiTableCell-body': { fontStyle: 'italic' },
                    '&.MuiTableCell-head': { fontWeight: 'normal' },
                }}
                disableSort
            />
            <CanAccess action="read" resource="books.year">
                <DataTable.Col
                    source="year"
                    field={NumberField}
                    align="right"
                />
            </CanAccess>
            <DataTable.Col sx={{ py: 0 }}>
                <EditButton />
            </DataTable.Col>
        </DataTable>
    </Wrapper>
);

const CustomEmpty = () => <div>No books found</div>;

export const Empty = () => (
    <Wrapper>
        <Box sx={{ mt: -7 }}>
            <h1>Default</h1>
            <DataTable data={[]} total={0}>
                <DataTable.Col source="id" />
                <DataTable.Col source="title" />
                <DataTable.Col source="author.name" />
                <DataTable.Col source="year" />
            </DataTable>
            <h1>Custom</h1>
            <DataTable data={[]} total={0} empty={<CustomEmpty />}>
                <DataTable.Col source="id" />
                <DataTable.Col source="title" />
                <DataTable.Col source="author.name" />
                <DataTable.Col source="year" />
            </DataTable>
        </Box>
    </Wrapper>
);

export const Hover = () => (
    <Wrapper>
        <DataTable hover={false}>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="author.name" />
            <DataTable.Col source="year" />
        </DataTable>
    </Wrapper>
);

export const Size = () => (
    <Wrapper>
        <Box sx={{ mt: -7 }}>
            <h1>Default (small)</h1>
            <DataTable>
                <DataTable.Col source="id" />
                <DataTable.Col source="title" />
                <DataTable.Col source="author.name" />
                <DataTable.Col source="year" />
            </DataTable>
            <h1>Medium</h1>
            <DataTable size="medium">
                <DataTable.Col source="id" />
                <DataTable.Col source="title" />
                <DataTable.Col source="author.name" />
                <DataTable.Col source="year" />
            </DataTable>
        </Box>
    </Wrapper>
);

export const SX = () => (
    <Wrapper>
        <DataTable
            sx={{
                '& .RaDataTable-rowOdd': {
                    backgroundColor: '#fee',
                },
            }}
        >
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="author.name" />
            <DataTable.Col source="year" />
        </DataTable>
    </Wrapper>
);

export const RowSx = () => (
    <Wrapper>
        <DataTable
            rowSx={(record: any) => ({
                backgroundColor: record.id % 2 ? 'white' : '#eee',
                ...(record.year > 1900 && {
                    '& td.column-year': { color: 'primary.main' },
                }),
            })}
        >
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="author.name" />
            <DataTable.Col source="year" />
        </DataTable>
    </Wrapper>
);

const StyledDataTable = styled(DataTable, {
    name: 'MyStyledDataTable',
    overridesResolver: (props, styles) => styles.root,
})(() => ({
    table: {
        width: '70%',
        backgroundColor: '#ffb',
    },
}));

export const StyledComponent = () => (
    <Wrapper>
        <StyledDataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="author.name" />
            <DataTable.Col source="year" />
        </StyledDataTable>
    </Wrapper>
);

export const ColumnStyles = () => (
    <Wrapper>
        <Box sx={{ mt: -7 }}>
            <h1>Full column</h1>
            <DataTable
                sx={{
                    '& .column-title': {
                        backgroundColor: '#fee',
                    },
                }}
            >
                <DataTable.Col source="id" />
                <DataTable.Col source="title" />
                <DataTable.Col source="author.name" />
                <DataTable.Col source="year" />
            </DataTable>
            <h1>Cells only</h1>
            <DataTable
                sx={{
                    '& td.column-title': {
                        backgroundColor: '#fee',
                    },
                }}
            >
                <DataTable.Col source="id" />
                <DataTable.Col source="title" />
                <DataTable.Col source="author.name" />
                <DataTable.Col source="year" />
            </DataTable>
            <h1>Hidden column on small screens</h1>
            <DataTable
                sx={{
                    '& .column-title': {
                        sm: { display: 'none' },
                        md: { display: 'table-cell' },
                    },
                }}
            >
                <DataTable.Col source="id" />
                <DataTable.Col source="title" />
                <DataTable.Col source="author.name" />
                <DataTable.Col source="year" />
            </DataTable>
        </Box>
    </Wrapper>
);

const MyCustomList = () => {
    const { data, total, isPending } = useGetList('books', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'id', order: 'DESC' },
    });

    return (
        <DataTable data={data} total={total} isPending={isPending}>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
        </DataTable>
    );
};

export const StandaloneStatic = () => (
    <AdminContext dataProvider={dataProvider} theme={theme}>
        <ResourceContextProvider value="books">
            <MyCustomList />
        </ResourceContextProvider>
    </AdminContext>
);

const MyCustomListInteractive = () => {
    const { data: books, isPending: isBooksPending } = useGetList('books');
    const listContext = useList({
        data: books,
        isPending: isBooksPending,
    });

    return (
        <ListContextProvider value={listContext}>
            <DataTable sx={{ mt: 6 }}>
                <DataTable.Col source="id" />
                <DataTable.Col source="title" />
            </DataTable>
        </ListContextProvider>
    );
};

export const StandaloneDynamic = () => (
    <AdminContext dataProvider={dataProvider} theme={theme}>
        <ResourceContextProvider value="books">
            <MyCustomListInteractive />
        </ResourceContextProvider>
    </AdminContext>
);

export const ErrorInFetch = () => (
    <AdminContext>
        <ListContextProvider
            value={
                {
                    error: new Error('Error in dataProvider'),
                } as any
            }
        >
            <ResourceContextProvider value="books">
                <DataTable>
                    <DataTable.Col source="id" />
                    <DataTable.Col source="title" />
                    <DataTable.Col source="author.name" />
                    <DataTable.Col source="year" />
                </DataTable>
            </ResourceContextProvider>
        </ListContextProvider>
    </AdminContext>
);

export const RowClickFalse = () => (
    <Wrapper>
        <DataTable rowClick={false}>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="author.name" />
            <DataTable.Col source="year" />
        </DataTable>
    </Wrapper>
);

const ExpandPanel = () => {
    const book = useRecordContext();
    return (
        <Box data-testid="ExpandPanel" p={2}>
            <i>{book?.title}</i>, by {book?.author.name} ({book?.year})
        </Box>
    );
};

export const Expand = () => (
    <Wrapper>
        <DataTable expand={<ExpandPanel />}>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="author.name" />
            <DataTable.Col source="year" />
        </DataTable>
    </Wrapper>
);

export const ExpandSingle = () => (
    <Wrapper>
        <DataTable expand={<ExpandPanel />} expandSingle>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="author.name" />
            <DataTable.Col source="year" />
        </DataTable>
    </Wrapper>
);

export const IsRowExpandable = () => (
    <Wrapper>
        <DataTable
            isRowExpandable={record => Boolean(record.id % 2)}
            expand={
                <SimpleShowLayout>
                    <TextField source="id" />
                    <TextField source="title" />
                    <TextField source="author.name" />
                    <TextField source="year" />
                </SimpleShowLayout>
            }
        >
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="author.name" />
            <DataTable.Col source="year" />
        </DataTable>
    </Wrapper>
);

const CustomBulkActionButtons = () => (
    <>
        <BulkExportButton />
        <BulkDeleteButton />
    </>
);

export const BulkActionButtons = () => (
    <Wrapper>
        <Box sx={{ mt: -7 }}>
            <h1>Default</h1>
            <DataTable>
                <DataTable.Col source="id" />
                <DataTable.Col source="title" />
                <DataTable.Col source="author.name" />
                <DataTable.Col source="year" />
            </DataTable>
            <h1>Disabled</h1>
            <DataTable bulkActionButtons={false}>
                <DataTable.Col source="id" />
                <DataTable.Col source="title" />
                <DataTable.Col source="author.name" />
                <DataTable.Col source="year" />
            </DataTable>
            <h1>Custom</h1>
            <DataTable bulkActionButtons={<CustomBulkActionButtons />}>
                <DataTable.Col source="id" />
                <DataTable.Col source="title" />
                <DataTable.Col source="author.name" />
                <DataTable.Col source="year" />
            </DataTable>
            <h1>Unselectable Rows</h1>
            <DataTable isRowSelectable={record => record.id % 2 === 0}>
                <DataTable.Col source="id" />
                <DataTable.Col source="title" />
                <DataTable.Col source="author.name" />
                <DataTable.Col source="year" />
            </DataTable>
        </Box>
    </Wrapper>
);

export const SelectAllButton = ({
    onlyDisplay,
}: {
    onlyDisplay?: 'default' | 'disabled' | 'custom';
}) => (
    <Wrapper>
        <Box sx={{ mt: -7 }}>
            {(!onlyDisplay || onlyDisplay === 'default') && (
                <>
                    <h1>Default</h1>
                    <DataTable>
                        <DataTable.Col source="id" />
                        <DataTable.Col source="title" />
                        <DataTable.Col source="author.name" />
                        <DataTable.Col source="year" />
                    </DataTable>
                </>
            )}
            {(!onlyDisplay || onlyDisplay === 'disabled') && (
                <>
                    <h1>Disabled</h1>
                    <DataTable
                        bulkActionsToolbar={
                            <BulkActionsToolbar selectAllButton={false}>
                                <BulkDeleteButton />
                            </BulkActionsToolbar>
                        }
                    >
                        <DataTable.Col source="id" />
                        <DataTable.Col source="title" />
                        <DataTable.Col source="author.name" />
                        <DataTable.Col source="year" />
                    </DataTable>
                </>
            )}
            {(!onlyDisplay || onlyDisplay === 'custom') && (
                <>
                    <h1>Custom</h1>
                    <DataTable
                        bulkActionsToolbar={
                            <BulkActionsToolbar
                                selectAllButton={
                                    <RaSelectAllButton label="Select all records" />
                                }
                            >
                                <BulkDeleteButton />
                            </BulkActionsToolbar>
                        }
                    >
                        <DataTable.Col source="id" />
                        <DataTable.Col source="title" />
                        <DataTable.Col source="author.name" />
                        <DataTable.Col source="year" />
                    </DataTable>
                </>
            )}
        </Box>
    </Wrapper>
);

export const IsRowSelectable = () => (
    <Wrapper>
        <DataTable isRowSelectable={record => Boolean(record.id % 2)}>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="author.name" />
            <DataTable.Col source="year" />
        </DataTable>
    </Wrapper>
);

const MyDataTableRow = ({ children }: DataTableRowProps) => {
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
            <TableCell padding="checkbox">
                <SelectRowCheckbox />
            </TableCell>
            {children}
        </TableRow>
    ) : null;
};

const MyDataTableBody = (props: DataTableBodyProps) => (
    <BaseDataTableBody {...props} row={MyDataTableRow} />
);

export const Body = () => (
    <Wrapper>
        <DataTable body={MyDataTableBody}>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="author.name" />
            <DataTable.Col source="year" />
        </DataTable>
    </Wrapper>
);

const MyDataTableHead = ({ children }: DataTableHeadProps) => (
    <TableHead>
        <TableRow>
            <TableCell variant="head"></TableCell>
            <TableCell variant="head" colSpan={2} sx={{ textAlign: 'center' }}>
                Main info
            </TableCell>
            <TableCell variant="head" colSpan={2} sx={{ textAlign: 'center' }}>
                Misc info
            </TableCell>
        </TableRow>
        <TableRow>
            <TableCell variant="head" padding="checkbox">
                <SelectPageCheckbox />
            </TableCell>
            {children}
        </TableRow>
    </TableHead>
);

export const Head = () => (
    <Wrapper i18nProvider={polyglotI18nProvider(() => defaultMessages, 'en')}>
        <DataTable head={MyDataTableHead}>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="author.name" />
            <DataTable.Col source="year" />
        </DataTable>
    </Wrapper>
);

const MyDataTableFoot = () => {
    const data = useDataTableDataContext();
    const totalSales = data.reduce(
        (sum, record) => sum + (record.sales ? record.sales : 0),
        0
    );
    return (
        <TableFooter>
            <TableRow>
                <TableCell
                    variant="footer"
                    colSpan={4}
                    sx={{ textAlign: 'right' }}
                >
                    Total sales
                </TableCell>
                <TableCell variant="footer" align="right">
                    {totalSales}
                </TableCell>
            </TableRow>
        </TableFooter>
    );
};

export const Foot = () => (
    <Wrapper
        i18nProvider={polyglotI18nProvider(() => defaultMessages, 'en')}
        resource="products"
        defaultDataProvider={fakeRestDataProvider({
            products: [
                {
                    id: 1,
                    name: 'Office jeans',
                    price: 45.99,
                    category_id: 1,
                    sales: 234,
                },
                {
                    id: 2,
                    name: 'Black elegance jeans',
                    price: 69.99,
                    category_id: 1,
                    sales: 150,
                },
                {
                    id: 3,
                    name: 'Slim fit jeans',
                    price: 55.99,
                    category_id: 1,
                    sales: 12,
                },
                {
                    id: 4,
                    name: 'Basic T-shirt',
                    price: 15.99,
                    category_id: 2,
                    sales: 376,
                },
                {
                    id: 5,
                    name: 'Basic cap',
                    price: 19.99,
                    category_id: 6,
                    sales: 54,
                },
            ],
            categories: [
                { id: 1, name: 'Jeans' },
                { id: 2, name: 'T-Shirts' },
                { id: 3, name: 'Jackets' },
                { id: 4, name: 'Shoes' },
                { id: 5, name: 'Accessories' },
                { id: 6, name: 'Hats' },
                { id: 7, name: 'Socks' },
                { id: 8, name: 'Shirts' },
                { id: 9, name: 'Sweaters' },
                { id: 10, name: 'Trousers' },
                { id: 11, name: 'Coats' },
                { id: 12, name: 'Dresses' },
                { id: 13, name: 'Skirts' },
                { id: 14, name: 'Swimwear' },
                { id: 15, name: 'Bags' },
            ],
        })}
    >
        <DataTable foot={MyDataTableFoot}>
            <DataTable.Col source="name" />
            <DataTable.NumberCol source="price" />
            <DataTable.Col label="Category">
                <ReferenceField source="category_id" reference="categories" />
            </DataTable.Col>
            <DataTable.NumberCol source="sales" />
        </DataTable>
    </Wrapper>
);

export const FullApp = ({
    rowClick,
}: {
    rowClick: DataTableProps['rowClick'];
}) => (
    <AdminContext
        dataProvider={dataProvider}
        i18nProvider={polyglotI18nProvider(() => defaultMessages, 'en')}
    >
        <AdminUI>
            <Resource
                name="books"
                list={() => (
                    <List
                        actions={
                            <TopToolbar>
                                <ColumnsButton />
                            </TopToolbar>
                        }
                    >
                        <DataTable
                            rowClick={rowClick}
                            expand={<ExpandDetails />}
                        >
                            <DataTable.Col source="id" />
                            <DataTable.Col source="title" />
                            <DataTable.Col source="author.name" />
                            <DataTable.Col source="year" />
                        </DataTable>
                    </List>
                )}
                edit={EditGuesser}
                show={ShowGuesser}
            />
        </AdminUI>
    </AdminContext>
);

FullApp.argTypes = {
    rowClick: {
        options: [
            'inferred',
            'show',
            'edit',
            'no-link',
            'expand',
            'toggleSelection',
            'function to expand',
            'function to toggleSelection',
        ],
        mapping: {
            inferred: undefined,
            show: 'show',
            edit: 'edit',
            'no-link': false,
            expand: 'expand',
            toggleSelection: 'toggleSelection',
            'function to expand': (id, resource, record) => {
                if (process.env.NODE_ENV === 'development') {
                    console.log('function to expand', id, resource, record);
                }
                return 'expand';
            },
            'function to toggleSelection': (id, resource, record) => {
                if (process.env.NODE_ENV === 'development') {
                    console.log(
                        'function to toggleSelection',
                        id,
                        resource,
                        record
                    );
                }
                return 'toggleSelection';
            },
        },
        control: { type: 'select' },
    },
};

const ExpandDetails = () => {
    const record = useRecordContext();

    return <Box p={2}>Expand: {record?.title}</Box>;
};

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
    allowedAction?: 'show' | 'edit' | 'delete' | 'invalid';
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
                        <DataTable key={allowedAction}>
                            <DataTable.Col source="id" />
                            <DataTable.Col source="title" />
                            <DataTable.Col source="author.name" />
                            <DataTable.Col source="year" />
                        </DataTable>
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
        options: ['show', 'edit', 'delete', 'none'],
        mapping: {
            show: 'show',
            edit: 'edit',
            delete: 'delete',
            none: 'invalid',
        },
        control: { type: 'select' },
    },
};

export const NonPrimitiveData = () => (
    <Wrapper i18nProvider={polyglotI18nProvider(() => defaultMessages, 'en')}>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="author" />
            <DataTable.Col source="year" />
        </DataTable>
    </Wrapper>
);

export const HeaderButton = () => (
    <Wrapper i18nProvider={polyglotI18nProvider(() => defaultMessages, 'en')}>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col label="Author" source="author.name" disableSort />
            <DataTable.Col source="year" />
            <DataTable.Col label={<CreateButton />}>
                <EditButton />
            </DataTable.Col>
        </DataTable>
    </Wrapper>
);
