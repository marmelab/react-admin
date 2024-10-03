import * as React from 'react';
import fakeRestDataProvider from 'ra-data-fakerest';

import {
    AuthProvider,
    CoreAdmin,
    EditBase,
    LinkToType,
    Resource,
    ShowBase,
    TestMemoryRouter,
    useGetPathForRecordCallback,
    useListController,
    WithRecord,
} from '..';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

export default {
    title: 'ra-core/routing/useGetPathForRecordCallback',
};

export const InferredWithoutAuthProviderWithBothShowAndEditView = () => (
    <TestMemoryRouter>
        <CoreAdmin dataProvider={dataProvider}>
            <Resource
                name="books"
                list={<BookList />}
                show={BookShow}
                edit={BookEdit}
            />
        </CoreAdmin>
    </TestMemoryRouter>
);

export const InferredWithoutAuthProviderWithShowViewOnly = () => (
    <TestMemoryRouter>
        <CoreAdmin dataProvider={dataProvider}>
            <Resource name="books" list={<BookList />} show={BookShow} />
        </CoreAdmin>
    </TestMemoryRouter>
);

export const InferredWithoutAuthProviderWithEditViewOnly = () => (
    <TestMemoryRouter>
        <CoreAdmin dataProvider={dataProvider}>
            <Resource name="books" list={<BookList />} edit={BookEdit} />
        </CoreAdmin>
    </TestMemoryRouter>
);

export const LinkSpecifiedWithoutAuthProvider = ({
    link = 'show',
}: {
    link: 'show' | 'edit' | false;
}) => (
    <TestMemoryRouter>
        <CoreAdmin dataProvider={dataProvider}>
            <Resource
                name="books"
                list={<BookList link={link} />}
                show={BookShow}
                edit={BookEdit}
            />
        </CoreAdmin>
    </TestMemoryRouter>
);

LinkSpecifiedWithoutAuthProvider.argTypes = {
    link: {
        options: ['inferred', 'show', 'edit', 'no-link'],
        mapping: {
            inferred: undefined,
            show: 'show',
            edit: 'edit',
            'no-link': false,
        },
        control: { type: 'select' },
    },
};

export const AccessControl = ({
    canAccessShow = false,
    canAccessEdit = false,
    link,
    authProvider = {
        login: () => Promise.resolve(),
        logout: () => Promise.resolve(),
        checkError: () => Promise.resolve(),
        checkAuth: () => Promise.resolve(),
        getPermissions: () => Promise.resolve(),
        canAccess: ({ action }) => {
            if (action === 'show') {
                return Promise.resolve(canAccessShow);
            }
            if (action === 'edit') {
                return Promise.resolve(canAccessEdit);
            }
            return Promise.resolve(true);
        },
    },
}: {
    canAccessShow?: boolean;
    canAccessEdit?: boolean;
    link?: LinkToType;
    authProvider?: AuthProvider;
}) => (
    <TestMemoryRouter>
        <CoreAdmin
            authProvider={authProvider}
            dataProvider={dataProvider}
            accessDenied={() => (
                <div>
                    <p>Access denied</p>
                    <Link to="/">Back to list</Link>
                </div>
            )}
        >
            <Resource
                name="books"
                list={<BookList link={link} />}
                show={BookShow}
                edit={BookEdit}
            />
        </CoreAdmin>
    </TestMemoryRouter>
);

AccessControl.argTypes = {
    canAccessShow: {
        control: { type: 'boolean' },
    },
    canAccessEdit: {
        control: { type: 'boolean' },
    },
    link: {
        options: ['inferred', 'show', 'edit', 'no-link'],
        mapping: {
            inferred: undefined,
            show: 'show',
            edit: 'edit',
            'no-link': false,
        },
        control: { type: 'select' },
    },
};

const BookList = ({ link }: { link?: LinkToType }) => {
    const { data } = useListController();
    const getPathForRecord = useGetPathForRecordCallback();
    const navigate = useNavigate();

    return (
        <table style={{ margin: 20 }}>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Year</th>
                </tr>
            </thead>
            <tbody>
                {data?.map(record => (
                    <tr
                        key={record.id}
                        style={{ cursor: 'pointer' }}
                        onClick={() =>
                            getPathForRecord({ record, link }).then(path => {
                                if (!path) return;
                                navigate(path);
                            })
                        }
                    >
                        <td>{record.id}</td>
                        <td>{record.title}</td>
                        <td>{record.authorId}</td>
                        <td>{record.year}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const BookShow = () => (
    <ShowBase>
        <div style={{ margin: 20 }}>
            <h1>Book show</h1>
            <WithRecord
                render={record => (
                    <div>
                        <p>Title: {record?.title}</p>
                        <p>Author ID: {record?.authorId}</p>
                    </div>
                )}
            />
            <Link to="..">Back to list</Link>
        </div>
    </ShowBase>
);

const BookEdit = () => (
    <EditBase>
        <div style={{ margin: 20 }}>
            <h1>Book edit</h1>
            <WithRecord
                render={record => (
                    <div>
                        <p>Title: {record?.title}</p>
                        <p>Author ID: {record?.authorId}</p>
                    </div>
                )}
            />
            <Link to="..">Back to list</Link>
        </div>
    </EditBase>
);

const dataProvider = fakeRestDataProvider(
    {
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
    },
    process.env.NODE_ENV === 'development'
);
