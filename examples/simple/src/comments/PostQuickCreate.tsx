import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
    SaveButton,
    SimpleForm,
    TextInput,
    Toolbar,
    required,
    ReduxState,
    useCreate,
    useNotify,
} from 'react-admin'; // eslint-disable-line import/no-unresolved

import CancelButton from './PostQuickCreateCancelButton';

const PREFIX = 'PostQuickCreate';

const classes = {
    form: `${PREFIX}-form`,
};

const StyledSimpleForm = styled(SimpleForm)({
    [`& .${classes.form}`]: { padding: 0 },
});

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

const PostQuickCreate = ({ onCancel, onSave, ...props }) => {
    const [create] = useCreate();
    const notify = useNotify();
    const submitting = useSelector<ReduxState, boolean>(
        state => state.admin.loading > 0
    );

    const handleSave = useCallback(
        values => {
            create('posts', values, {
                onSuccess: ({ data }) => {
                    onSave(data);
                },
                onFailure: error => {
                    notify(error.message, 'error');
                },
            });
        },
        [create, notify, onSave]
    );

    return (
        <StyledSimpleForm
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
        </StyledSimpleForm>
    );
};

PostQuickCreate.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default PostQuickCreate;
