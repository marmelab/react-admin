import * as React from 'react';
import { ListBase } from 'ra-core';
import {
    Admin,
    Resource,
    CreateButton,
    Datagrid,
    FilterButton,
    FilterForm,
    Pagination,
    TextField,
    TextInput,
} from 'react-admin';
import { Stack } from '@mui/material';
import fakerestDataProvider from 'ra-data-fakerest';

export default { title: 'ra-ui-materialui/list/filter/FilterButton' };

const data = {
    posts: [
        {
            id: 1,
            title:
                'Accusantium qui nihil voluptatum quia voluptas maxime ab similique',
            body:
                'In facilis aut aut odit hic doloribus. Fugit possimus perspiciatis sit molestias in. Sunt dignissimos sed quis at vitae veniam amet. Sint sunt perspiciatis quis doloribus aperiam numquam consequatur et. Blanditiis aut earum incidunt eos magnam et voluptatem. Minima iure voluptatum autem. At eaque sit aperiam minima aut in illum.',
        },
        {
            id: 2,
            title: 'Sint dignissimos in architecto aut',
            body:
                'Quam earum itaque corrupti labore quas nihil sed. Dolores sunt culpa voluptates exercitationem eveniet totam rerum. Molestias perspiciatis rem numquam accusamus.',
        },
        {
            id: 3,
            title: 'Perspiciatis adipisci vero qui ipsam iure porro',
            body:
                'Ut ad consequatur esse illum. Ex dolore porro et ut sit. Commodi qui sed et voluptatibus laudantium.',
        },
        {
            id: 4,
            title: 'Maiores et itaque aut perspiciatis',
            body:
                'Et quo voluptas odit veniam omnis dolores. Odit commodi consequuntur necessitatibus dolorem officia. Reiciendis quas exercitationem libero sed. Itaque non facilis sit tempore aut doloribus.',
        },
        {
            id: 5,
            title: 'Sed quo et et fugiat modi',
            body:
                'Consequuntur id aut soluta aspernatur sit. Aut doloremque recusandae sit saepe ut quas earum. Quae pariatur iure et ducimus non. Cupiditate dolorem itaque in sit.',
        },
        {
            id: 6,
            title: 'Minima ea vero omnis odit officiis aut',
            body:
                'Omnis rerum voluptatem illum. Amet totam minus id qui aspernatur. Adipisci commodi velit sapiente architecto et molestias. Maiores doloribus quis occaecati quidem laborum. Quae quia quaerat est itaque. Vero assumenda quia tempora libero dicta quis asperiores magnam. Necessitatibus accusantium saepe commodi ut.',
        },
        {
            id: 7,
            title: 'Illum veritatis corrupti exercitationem sed velit',
            body:
                'Omnis hic quo aperiam fugiat iure amet est. Molestias ratione aut et dolor earum magnam placeat. Ad a quam ea amet hic omnis rerum.',
        },
        {
            id: 8,
            title:
                'Culpa possimus quibusdam nostrum enim tempore rerum odit excepturi',
            body:
                'Qui quos exercitationem itaque quia. Repellat libero ut recusandae quidem repudiandae ipsam laudantium. Eveniet quos et quo omnis aut commodi incidunt.',
        },
        {
            id: 9,
            title: 'A voluptas eius eveniet ut commodi dolor',
            body:
                'Sed necessitatibus nesciunt nesciunt aut non sunt. Quam ut in a sed ducimus eos qui sint. Commodi illo necessitatibus sint explicabo maiores. Maxime voluptates sit distinctio quo excepturi. Qui aliquid debitis repellendus distinctio et aut. Ex debitis et quasi id.',
        },
        {
            id: 10,
            title: 'Totam vel quasi a odio et nihil',
            body:
                'Excepturi veritatis velit rerum nemo voluptatem illum tempora eos. Et impedit sed qui et iusto. A alias asperiores quia quo.',
        },
        {
            id: 11,
            title: 'Omnis voluptate enim similique est possimus',
            body:
                'Velit eos vero reprehenderit ut assumenda saepe qui. Quasi aut laboriosam quas voluptate voluptatem. Et eos officia repudiandae quaerat. Mollitia libero numquam laborum eos.',
        },
        {
            id: 12,
            title: 'Qui tempore rerum et voluptates',
            body:
                'Occaecati rem perferendis dolor aut numquam cupiditate. At tenetur dolores pariatur et libero asperiores porro voluptas. Officiis corporis sed eos repellendus perferendis distinctio hic consequatur.',
        },
        {
            id: 13,
            title: 'Fusce massa lorem, pulvinar a posuere ut, accumsan ac nisi',
            body:
                'Quam earum itaque corrupti labore quas nihil sed. Dolores sunt culpa voluptates exercitationem eveniet totam rerum. Molestias perspiciatis rem numquam accusamus.',
        },
    ],
};
const postFilters = [
    <TextInput label="Search" source="q" alwaysOn />,
    <TextInput label="Title" source="title" defaultValue="Hello, World!" />,
];

const ListToolbar = () => (
    <Stack direction="row" justifyContent="space-between">
        <FilterForm filters={postFilters} />
        <div>
            <FilterButton filters={postFilters} />
            <CreateButton />
        </div>
    </Stack>
);

const PostList = () => (
    <ListBase>
        <ListToolbar />
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="body" />
        </Datagrid>
        <Pagination />
    </ListBase>
);

export const Basic = () => (
    <Admin dataProvider={fakerestDataProvider(data)}>
        <Resource name="posts" list={PostList} />
    </Admin>
);
