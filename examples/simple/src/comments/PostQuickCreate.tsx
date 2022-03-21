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
    Form,
    TextInput,
    required,
    useCreate,
    useCreateSuggestionContext,
    useNotify,
    useTranslate,
} from 'react-admin'; // eslint-disable-line import/no-unresolved

import CancelButton from './PostQuickCreateCancelButton';

const PostQuickCreate = props => {
    const [create] = useCreate();
    const notify = useNotify();

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
            <Form onSubmit={handleSave} {...props}>
                <DialogTitle>{translate('simple.create-post')}</DialogTitle>
                <DialogContent>
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
                </DialogContent>
                <DialogActions>
                    <SaveButton />
                    <CancelButton onClick={onCancel} />
                </DialogActions>
            </Form>
        </Dialog>
    );
};

export default PostQuickCreate;
