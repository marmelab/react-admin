import * as React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { useCallback } from 'react';
import {
    SaveButton,
    SimpleForm,
    TextInput,
    required,
    useCreate,
    useCreateSuggestionContext,
    useNotify,
    useLoading,
    useTranslate,
} from 'react-admin'; // eslint-disable-line import/no-unresolved

import CancelButton from './PostQuickCreateCancelButton';

const PostQuickCreate = props => {
    const [create] = useCreate();
    const notify = useNotify();
    const submitting = useLoading();

    const { onCancel, onCreate } = useCreateSuggestionContext();
    const handleSave = useCallback(
        values => {
            create(
                'posts',
                { data: values },
                {
                    onSuccess: data => {
                        onCreate(data);
                    },
                    onError: (error: Error) => {
                        notify(error.message, { type: 'error' });
                    },
                }
            );
        },
        [create, notify, onCreate]
    );

    const translate = useTranslate();

    return (
        <Dialog
            data-testid="dialog-add-post"
            open
            fullWidth
            onClose={onCancel}
            aria-label={translate('simple.create-post')}
        >
            <DialogTitle>{translate('simple.create-post')}</DialogTitle>
            <DialogContent>
                <SimpleForm
                    id="post-quick-create"
                    onSubmit={handleSave}
                    saving={submitting}
                    toolbar={null}
                    {...props}
                >
                    <TextInput
                        defaultValue=""
                        source="title"
                        validate={required()}
                    />
                    <TextInput
                        defaultValue=""
                        source="teaser"
                        validate={required()}
                        fullWidth={true}
                        multiline={true}
                    />
                </SimpleForm>
            </DialogContent>
            <DialogActions>
                <SaveButton form="post-quick-create" submitOnEnter />
                <CancelButton onClick={onCancel} />
            </DialogActions>
        </Dialog>
    );
};

export default PostQuickCreate;
