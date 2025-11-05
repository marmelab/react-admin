import * as React from 'react';
import fakeRestDataProvider from 'ra-data-fakerest';
import { TestMemoryRouter } from '../../routing';
import { EditBase } from '../edit';
import {
    Admin,
    DataTable,
    TextInput,
    SimpleFormIterator,
    SimpleForm,
} from '../../test-ui';
import { ListBase } from '../list';
import { Resource } from '../../core';
import { ArrayInputBase } from './ArrayInputBase';

export default { title: 'ra-core/controller/input/ArrayInputBase' };

export const Basic = () => (
    <TestMemoryRouter initialEntries={['/posts/1']}>
        <Admin
            dataProvider={fakeRestDataProvider(
                {
                    posts: [
                        {
                            id: 1,
                            title: 'Post 1',
                            tags: [
                                { name: 'Tag 1', color: 'red' },
                                { name: 'Tag 2', color: 'blue' },
                            ],
                        },
                        { id: 2, title: 'Post 2', tags: [] },
                    ],
                },
                process.env.NODE_ENV !== 'test',
                process.env.NODE_ENV !== 'test' ? 300 : 0
            )}
        >
            <Resource
                name="posts"
                list={
                    <ListBase>
                        <DataTable>
                            <DataTable.Col source="title" />
                            <DataTable.Col
                                label="Tags"
                                render={record =>
                                    record.tags
                                        ? record.tags
                                              .map(tag => tag.name)
                                              .join(', ')
                                        : ''
                                }
                            />
                        </DataTable>
                    </ListBase>
                }
                edit={
                    <EditBase>
                        <SimpleForm>
                            <TextInput source="title" />
                            <div>
                                <div>Tags:</div>
                                <ArrayInputBase source="tags">
                                    <SimpleFormIterator>
                                        <TextInput source="name" />
                                        <TextInput source="color" />
                                    </SimpleFormIterator>
                                </ArrayInputBase>
                            </div>
                        </SimpleForm>
                    </EditBase>
                }
            />
        </Admin>
    </TestMemoryRouter>
);
