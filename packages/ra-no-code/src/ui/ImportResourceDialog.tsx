import React, { FormEvent, useState } from 'react';
import {
    Button,
    Dialog,
    DialogProps,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useQueryClient } from 'react-query';

import { useNotify } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import { useImportResourceFromCsv } from './useImportResourceFromCsv';

export const ImportResourceDialog = (props: ImportResourceDialogProps) => {
    const [file, setFile] = useState<File>();
    const [resource, setResource] = useState<string>('');
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const notify = useNotify();

    const handleClose = () => {
        if (props.onClose) {
            props.onClose();
        }
    };

    const [parsing, importResource] = useImportResourceFromCsv();

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const acceptedFile = acceptedFiles[0];
            if (acceptedFile) {
                setFile(acceptedFile);
                setResource(acceptedFile.name.split('.')[0]);
            }
        }
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        if (resource && file) {
            importResource(resource, file)
                .then(({ resource, resourceAlreadyExists }) => {
                    handleClose();
                    navigate(`/${resource}`);

                    if (resourceAlreadyExists) {
                        // If we imported more records for an existing resource,
                        // we must refresh the list
                        queryClient.refetchQueries([resource, 'getList']);
                    }
                })
                .catch(() => {
                    notify('An error occured while handling this CSV file');
                });
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'text/csv',
        onDrop,
    });
    const { ref, ...rootProps } = getRootProps();

    return (
        <Dialog
            {...props}
            aria-labelledby="import-resource-dialog-title"
            aria-describedby="import-resource-dialog-description"
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle id="import-resource-dialog-title">
                    Import a new resource
                </DialogTitle>
                {parsing ? (
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Generating the user interface for the resource,
                            please wait...
                        </DialogContentText>
                    </DialogContent>
                ) : (
                    <>
                        <>
                            <DialogContent {...rootProps}>
                                <input
                                    aria-label="CSV File"
                                    aria-describedby="#csv-description"
                                    {...getInputProps()}
                                />
                                <DialogContentText id="alert-dialog-description">
                                    Welcome to react-admin no-code!
                                </DialogContentText>
                                <DialogContentText id="csv-description">
                                    Drop a csv file here or click here to choose
                                    a local file.
                                </DialogContentText>
                            </DialogContent>
                        </>
                        {!!file && (
                            <DialogContent>
                                <TextField
                                    label="Resource name"
                                    value={resource}
                                    onChange={event =>
                                        setResource(event.target.value)
                                    }
                                    autoFocus
                                    onFocus={e => e.currentTarget.select()}
                                />
                            </DialogContent>
                        )}
                    </>
                )}
                <DialogActions>
                    {!!file && resource && (
                        <Button disabled={parsing} type="submit">
                            Import
                        </Button>
                    )}
                    <Button disabled={parsing} onClick={() => handleClose()}>
                        Cancel
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export interface ImportResourceDialogProps
    extends Omit<DialogProps, 'onClose'> {
    onClose?: () => void;
}
