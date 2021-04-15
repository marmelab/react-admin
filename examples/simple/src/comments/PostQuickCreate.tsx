import * as React from 'react';
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
    CREATE,
    SaveButton,
    SimpleForm,
    TextInput,
    Toolbar,
    required,
    showNotification,
    ReduxState,
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

const useStyles = makeStyles({
    form: { padding: 0 },
});

const PostQuickCreate = ({ onCancel, onSave, ...props }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const submitting = useSelector<ReduxState, boolean>(
        state => state.admin.loading > 0
    );

    const handleSave = useCallback(
        values => {
            dispatch({
                type: 'QUICK_CREATE',
                payload: { data: values },
                meta: {
                    fetch: CREATE,
                    resource: 'posts',
                    onSuccess: {
                        callback: ({ payload: { data } }) => onSave(data),
                    },
                    onFailure: {
                        callback: ({ error }) => {
                            dispatch(showNotification(error.message, 'error'));
                        },
                    },
                },
            });
        },
        [dispatch, onSave]
    );

    return (
        <SimpleForm
            save={handleSave}
            saving={submitting}
            redirect={false}
            toolbar={
                <PostQuickCreateToolbar
                    onCancel={onCancel}
                    submitting={submitting}
                />
            }
            classes={{ form: classes.form }}
            {...props}
        >
            <TextInput source="title" validate={required()} />
            <TextInput
                source="teaser"
                validate={required()}
                fullWidth={true}
                multiline={true}
            />
        </SimpleForm>
    );
};

PostQuickCreate.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default PostQuickCreate;
