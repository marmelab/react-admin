import React from 'react';
import { connect } from 'react-redux';
import Resource from '../../src/crud/Resource';
import Column from '../../src/list/column/Column';
import Show from '../../src/detail/Show';

const Post = ({ id }) => (
    <Resource name="posts" path="http://localhost:3000/posts">
        <Show title="Post detail" id={id}>
            <Column label="id" source="id"/>
            <Column label="title" source="title"/>
            <Column label="published_at" source="published_at"/>
            <Column label="average_note" source="average_note"/>
            <Column label="views" source="views"/>
        </Show>
    </Resource>
);

function mapStateToProps(state, ownProps) {
    return { id: ownProps.params.id };
}

export default connect(
    mapStateToProps
)(Post);
