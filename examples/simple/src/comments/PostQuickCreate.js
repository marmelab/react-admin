import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
    CREATE,
    LongTextInput,
    SaveButton,
    SimpleForm,
    TextInput,
    Toolbar,
    required,
} from 'react-admin'; // eslint-disable-line import/no-unresolved

import CancelButton from './PostQuickCreateCancelButton';

// We need a custom toolbar to add our custom buttons
// The CancelButton allows to close the modal without submitting anything
const PostQuickCreateToolbar = ({ submitting, onCancel, ...props }) => (
    <Toolbar {...props} disableGutters>
        <SaveButton />
        <CancelButton onClick={onCancel} />
    </Toolbar>
);

PostQuickCreateToolbar.propTypes = {
    submitting: PropTypes.bool,
    onCancel: PropTypes.func.isRequired,
};

const styles = {
    form: { padding: 0 },
};

class PostQuickCreateView extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        onSave: PropTypes.func.isRequired,
        submitting: PropTypes.bool.isRequired,
    };

    handleSave = values => {
        const { dispatch, onSave } = this.props;
        dispatch({
            type: 'QUICK_CREATE',
            payload: { data: values },
            meta: {
                fetch: CREATE,
                resource: 'posts',
                onSuccess: {
                    callback: ({ payload: { data } }) => onSave(data),
                },
                onError: {
                    callback: ({ error }) => this.setState({ error }),
                },
            },
        });
    };

    render() {
        const { classes, submitting, onCancel } = this.props;

        return (
            <SimpleForm
                form="post-create"
                save={this.handleSave}
                saving={submitting}
                redirect={false}
                toolbar={
                    <PostQuickCreateToolbar
                        onCancel={onCancel}
                        submitting={submitting}
                    />
                }
                classes={{ form: classes.form }}
            >
                <TextInput source="title" validate={required()} />
                <LongTextInput source="teaser" validate={required()} />
            </SimpleForm>
        );
    }
}

const mapStateToProps = state => ({
    submitting: state.admin.loading > 0,
});

export default connect(mapStateToProps)(
    withStyles(styles)(PostQuickCreateView)
);
