import React from 'react';
import { connect } from 'react-redux';
import Resource from './Resource';
import List from './List';
import Column from './Column';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';

const App = ({ isLoading }) => (
    <div>
        <AppBar title="React Admin" iconElementRight={isLoading ? <CircularProgress color="#fff" size={0.5} /> : <span/>}/>

        <Resource name="posts" path="http://localhost:3000/posts">
            <List title="All posts">
                <Column label="id" source="id"/>
                <Column label="title" source="title"/>
                <Column label="published_at" source="published_at"/>
                <Column label="average_note" source="average_note"/>
                <Column label="views" source="views"/>
            </List>
        </Resource>
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

function mapStateToProps({ loading }) {
    return { isLoading: loading > 0 };
}

export default connect(
  mapStateToProps,
)(App);
