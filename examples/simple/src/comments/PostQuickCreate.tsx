import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import {
    SaveButton,
    SimpleForm,
    TextInput,
    Toolbar,
    required,
    ReduxState,
    useCreate,
    useCreateSuggestionContext,
    useNotify,
    useTranslate,
} from 'react-admin'; // eslint-disable-line import/no-unresolved

import CancelButton from './PostQuickCreateCancelButton';

const StyledSimpleForm = styled(SimpleForm)({
    [`& .MuiCardContent-root`]: { padding: 0 },
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

const PostQuickCreate = props => {
    const { onCancel, onCreate } = useCreateSuggestionContext();
    const [create] = useCreate();
    const notify = useNotify();
    const submitting = useSelector<ReduxState, boolean>(
        state => state.admin.loading > 0
    );

    const handleSave = useCallback(
        values => {
            create('posts', values, {
                onSuccess: ({ data }) => {
                    onCreate(data);
                },
                onFailure: error => {
                    notify(error.message, 'error');
                },
            });
        },
        [create, notify, onCreate]
    );
    const translate = useTranslate();

    return (
        <Dialog
            data-testid="dialog-add-post"
            fullWidth
            open
            onClose={onCancel}
            aria-label={translate('simple.create-post')}
        >
            <DialogTitle>{translate('simple.create-post')}</DialogTitle>
            <DialogContent>
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
                    {...props}
                >
                    <TextInput
                        source="title"
                        defaultValue=""
                        validate={required()}
                    />
                    <TextInput
                        defaultValue=""
                        source="teaser"
                        validate={required()}
                        fullWidth={true}
                        multiline={true}
                    />
                </StyledSimpleForm>
            </DialogContent>
        </Dialog>
    );
};

export default PostQuickCreate;
