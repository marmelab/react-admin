import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import {
    CREATE,
    LongTextInput,
    SaveButton,
    SimpleForm,
    TextInput,
    Toolbar,
    required,
    showNotification,
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

const PostQuickCreate = ({ onCancel, onSave }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const submitting = useSelector(state => state.admin.loading > 0);

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
                    onError: {
                        callback: ({ error }) => {
                            dispatch(showNotification(error.message, 'error'));
                        },
                    },
                },
            });
        },
        [onSave]
    );

    return (
        <SimpleForm
            form="post-create"
            save={handleSave}
            saving={submitting}
            redirect={false}
            toolbar={useMemo(
                () => props => (
                    <PostQuickCreateToolbar
                        onCancel={onCancel}
                        submitting={submitting}
                        {...props}
                    />
                ),
                [onCancel, submitting]
            )}
            classes={{ form: classes.form }}
        >
            <TextInput source="title" validate={required()} />
            <LongTextInput source="teaser" validate={required()} />
        </SimpleForm>
    );
};

PostQuickCreate.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default PostQuickCreate;
