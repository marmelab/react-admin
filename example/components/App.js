import React from 'react';
import Resource from './Resource';
import List from './List';
import Column from './Column';

const App = () => (
    <div>
        <div style={{ width: '45%', float: 'left' }}>
            <Resource name="posts" path="http://localhost:3000/posts">
                <List>
                    <Column label="id" source="id"/>
                    <Column label="title" source="title"/>
                    <Column label="published_at" source="published_at"/>
                    <Column label="average_note" source="average_note"/>
                    <Column label="views" source="views"/>
                </List>
            </Resource>
        </div>
        {/*
        <div style={{ width: '45%', float: 'left' }}>
            <Resource name="comments" path="http://localhost:3000/comments">
                <List>
                    <Column label="id" source="id"/>
                    <Column label="post_id" source="post_id"/>
                </List>
            </Resource>
        </div>
        */}
    </div>
);

export default App;
