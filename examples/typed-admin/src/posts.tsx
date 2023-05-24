import { Datagrid, List } from 'react-admin';
import { TextField } from './generated/Post';

export const PostList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="content" />
        </Datagrid>
    </List>
);
