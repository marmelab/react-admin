import * as React from 'react';
import { ReactElement, useState } from 'react';
import { IconButton, IconButtonProps } from '@mui/material';
import RemoveIcon from '@mui/icons-material/RemoveCircleOutline';
import { useTranslate } from 'ra-core';

import { RemoveSavedQueryDialog } from './RemoveSavedQueryDialog';

export const RemoveSavedQueryIconButton = (
    props: IconButtonProps
): ReactElement => {
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const handleConfirmationClose = (): void => {
        setConfirmationOpen(false);
    };

    const handleRemoveQueryClick = (): void => {
        setConfirmationOpen(true);
    };
    const translate = useTranslate();

    return (
        <>
            <IconButton
                aria-label={translate('ra.saved_queries.remove_label', {
                    _: 'Remove saved query',
                })}
                size="small"
                onClick={handleRemoveQueryClick}
                {...props}
            >
                <RemoveIcon />
            </IconButton>

            <RemoveSavedQueryDialog
                open={confirmationOpen}
                onClose={handleConfirmationClose}
            />
        </>
    );
};
