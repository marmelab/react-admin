import React from 'react';
import Resource from './Resource';
import List from './List';

const App = () => (
    <div>
        <div style={{ width: '45%', float: 'left' }}>
            <Resource name="comments" path="/comments">
                <List/>
            </Resource>
        </div>
        {/*
        <div style={{ width: '45%', float: 'left' }}>
            <Resource name="posts" path="/posts">
                <List/>
            </Resource>
        </div>
        */}
    </div>
);

export default App;
