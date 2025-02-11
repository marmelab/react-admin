import {
    Alert,
    Box,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Link as MuiLink,
    Stack,
    Typography,
} from '@mui/material';
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

import { MouseEvent, useEffect, useState } from 'react';
import * as sampleCsv from './contacts_export.csv?raw';

const SAMPLE_URL = `data:text/csv;name=crm_contacts_sample.csv;charset=utf-8,${encodeURIComponent(sampleCsv.default)}`;

type ContactImportModalProps = {
    open: boolean;
    onClose(): void;
};

export function ContactImportDialog({
    open,
    onClose,
}: ContactImportModalProps) {
    const refresh = useRefresh();
    const processBatch = useContactImport();
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

    const startImport = () => {
        if (!file) return;
        parseCsv(file);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleReset = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        reset();
    };

    return (
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogCloseButton onClose={handleClose} />
            <DialogTitle>Import</DialogTitle>
            <DialogContent>
                <Form>
                    <Stack spacing={2}>
                        {importer.state === 'running' && (
                            <Stack gap={2}>
                                <Alert
                                    severity="info"
                                    action={
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                height: '100%',
                                                alignItems: 'center',
                                                padding: '0',
                                            }}
                                        >
                                            <CircularProgress size={20} />
                                        </Box>
                                    }
                                    sx={{
                                        alignItems: 'center',
                                        '& .MuiAlert-action': {
                                            padding: 0,
                                            marginRight: 0,
                                        },
                                    }}
                                >
                                    The import is running, please do not close
                                    this tab.
                                </Alert>
                                <Typography variant="body2">
                                    Imported{' '}
                                    <strong>
                                        {importer.importCount} /{' '}
                                        {importer.rowCount}
                                    </strong>{' '}
                                    contacts, with{' '}
                                    <strong>{importer.errorCount}</strong>{' '}
                                    errors.
                                    {importer.remainingTime !== null && (
                                        <>
                                            {' '}
                                            Estimated remaining time:{' '}
                                            <strong>
                                                {millisecondsToTime(
                                                    importer.remainingTime
                                                )}
                                            </strong>
                                            .{' '}
                                            <MuiLink
                                                href="#"
                                                onClick={handleReset}
                                                color="error"
                                            >
                                                Stop import
                                            </MuiLink>
                                        </>
                                    )}
                                </Typography>
                            </Stack>
                        )}

                        {importer.state === 'error' && (
                            <Alert severity="error">
                                Failed to import this file, please make sure
                                your provided a valid CSV file.
                            </Alert>
                        )}

                        {importer.state === 'complete' && (
                            <Alert severity="success">
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
                                            download={'crm_contacts_sample.csv'}
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
                <Toolbar sx={{ width: '100%' }}>
                    {importer.state === 'idle' ? (
                        <Button
                            label="Import"
                            variant="contained"
                            onClick={startImport}
                            disabled={!file}
                        />
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
