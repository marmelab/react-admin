import * as React from 'react';
import { Fragment, useState, useCallback } from 'react';
import { useWatch } from 'react-hook-form';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    ReferenceInput,
    SelectInput,
    useTranslate,
    required,
} from 'react-admin';

import PostQuickCreate from './PostQuickCreate';
import PostPreview from './PostPreview';

const PostReferenceInput = () => {
    const translate = useTranslate();

    const [showPreviewDialog, setShowPreviewDialog] = useState(false);
    const postId = useWatch({ name: 'post_id' });

    const handleShowClick = useCallback(
        event => {
            event.preventDefault();
            setShowPreviewDialog(true);
        },
        [setShowPreviewDialog]
    );

    const handleCloseShow = useCallback(() => {
        setShowPreviewDialog(false);
    }, [setShowPreviewDialog]);

    return (
        <>
            <ReferenceInput
                source="post_id"
                reference="posts"
                perPage={10000}
                sort={{ field: 'title', order: 'ASC' as const }}
            >
                <SelectInput
                    create={<PostQuickCreate />}
                    optionText="title"
                    validate={required()}
                />
            </ReferenceInput>
            {postId ? (
                <Fragment>
                    <Button
                        data-testid="button-show-post"
                        sx={{ margin: '10px 24px', position: 'relative' }}
                        onClick={handleShowClick}
                    >
                        {translate('ra.action.show')}
                    </Button>
                    <Dialog
                        data-testid="dialog-show-post"
                        fullWidth
                        open={showPreviewDialog}
                        onClose={handleCloseShow}
                        aria-label={translate('simple.create-post')}
                    >
                        <DialogTitle>
                            {translate('simple.create-post')}
                        </DialogTitle>
                        <DialogContent>
                            <PostPreview id={postId} resource="posts" />
                        </DialogContent>
                        <DialogActions>
                            <Button
                                data-testid="button-close-modal"
                                onClick={handleCloseShow}
                            >
                                {translate('simple.action.close')}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Fragment>
            ) : null}
        </>
    );
};

export default PostReferenceInput;
