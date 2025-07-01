/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { List, DataTable, useRecordContext } from 'react-admin';

const CustomEmpty = () => <div>No posts found</div>;

const PostPanel = () => {
    const record = useRecordContext();
    return <div dangerouslySetInnerHTML={{ __html: record.body }} />;
};

const postRowStyle = (record, index) => ({
    backgroundColor: record.nb_views >= 500 ? '#efe' : 'white',
});

const PostList = () => (
    <List>
        <DataTable
            bulkActionButtons={false}
            empty={<CustomEmpty />}
            expand={<PostPanel />}
            expandSingle
            rowClick={false}
            rowSx={postRowStyle}
            sx={{
                '& .RaDataTable-row': {
                    backgroundColor: 'white',
                },
                '& .RaDataTable-row:hover': {
                    backgroundColor: '#f5f5f5',
                },
            }}>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="body" />
        </DataTable>
    </List>
);

export default PostList;
