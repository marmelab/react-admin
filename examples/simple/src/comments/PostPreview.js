import React from 'react';
import { connect } from 'react-redux';
import { SimpleShowLayout, TextField } from 'react-admin';

const PostPreviewView = ({ isLoading, ...props }) => (
    <SimpleShowLayout {...props}>
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="teaser" />
    </SimpleShowLayout>
);

const mapStateToProps = (state, props) => ({
    record: state.admin.resources[props.resource]
        ? state.admin.resources[props.resource].data[props.id]
        : null,
    isLoading: state.admin.loading > 0,
    version: state.admin.ui.viewVersion,
});

export default connect(
    mapStateToProps,
    {}
)(PostPreviewView);
