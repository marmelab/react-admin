import { Box, CircularProgress, Stack } from '@mui/material';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
    Button,
    FileField,
    FileInput,
    Form,
    Toolbar,
    useRefresh,
} from 'react-admin';
import { Link } from 'react-router-dom';
import { DialogCloseButton } from '../misc/DialogCloseButton';
import { usePapaParse } from '../misc/usePapaParse';
import { ContactImportSchema, useContactImport } from './useContactImport';

import { useEffect, useState } from 'react';
import * as sampleCsv from './contacts_export.csv?raw';

const SAMPLE_URL = `data:text/csv;name=crm_contacts_sample.csv;charset=utf-8,${encodeURIComponent(sampleCsv.default)}`;

type ContactImportModalProps = {
    open: boolean;
    onClose(): void;
};

export function ContactImportModal({ open, onClose }: ContactImportModalProps) {
    const refresh = useRefresh();
    const { processBatch } = useContactImport();
    const { importer, parseCsv, reset } = usePapaParse<ContactImportSchema>({
        batchSize: 10,
        processBatch,
    });

    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (importer.state === 'complete') {
            refresh();
        }
    }, [importer.state, refresh]);

    const handleFileChange = (file: File | null) => {
        setFile(file);
    };

    const startImport = async () => {
        if (!file) {
            return;
        }

        parseCsv(file);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={open} maxWidth="lg" fullWidth>
            <DialogCloseButton onClose={handleClose} />
            <DialogTitle>Import</DialogTitle>
            <DialogContent>
                <Form>
                    <Stack spacing={2}>
                        {importer.state === 'running' && (
                            <Alert
                                severity="info"
                                variant="outlined"
                                action={
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            height: '100%',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <CircularProgress size={20} />
                                    </Box>
                                }
                            >
                                Import is running, please do not close this tab.{' '}
                                Imported {importer.importCount} /{' '}
                                {importer.rowCount}, with {importer.errorCount}{' '}
                                errors.
                                {importer.remainingTime !== null && (
                                    <>
                                        <br />
                                        Estimated remaining time:{' '}
                                        {millisecondsToTime(
                                            importer.remainingTime
                                        )}
                                    </>
                                )}
                            </Alert>
                        )}

                        {importer.state === 'error' && (
                            <Alert severity="error" variant="outlined">
                                Failed to import this file, please make sure
                                your provided a valid CSV file.
                            </Alert>
                        )}

                        {importer.state === 'complete' && (
                            <Alert severity="success" variant="outlined">
                                Contacts import complete. Imported{' '}
                                {importer.importCount} contacts, with{' '}
                                {importer.errorCount} errors
                            </Alert>
                        )}

                        {importer.state === 'idle' && (
                            <>
                                <Alert
                                    severity="info"
                                    action={
                                        <Button
                                            component={Link}
                                            label="Download CSV sample"
                                            color="info"
                                            to={SAMPLE_URL}
                                        />
                                    }
                                >
                                    Here is a sample CSV file you can use as a
                                    template
                                </Alert>

                                <FileInput
                                    source="csv"
                                    label="CSV File"
                                    accept={{ 'text/csv': ['.csv'] }}
                                    onChange={handleFileChange}
                                >
                                    <FileField source="src" title="title" />
                                </FileInput>
                            </>
                        )}
                    </Stack>
                </Form>
            </DialogContent>
            <DialogActions
                sx={{
                    p: 0,
                    justifyContent: 'flex-start',
                }}
            >
                <Toolbar
                    sx={{
                        width: '100%',
                    }}
                >
                    {importer.state === 'idle' ? (
                        <>
                            <Button
                                label="Import"
                                variant="contained"
                                onClick={startImport}
                                disabled={!file}
                            />
                        </>
                    ) : (
                        <Button
                            label="Close"
                            onClick={handleClose}
                            disabled={importer.state === 'running'}
                        />
                    )}
                </Toolbar>
            </DialogActions>
        </Dialog>
    );
}

function millisecondsToTime(ms: number) {
    var seconds = Math.floor((ms / 1000) % 60);
    var minutes = Math.floor((ms / (60 * 1000)) % 60);

    return `${minutes}m ${seconds}s`;
}
