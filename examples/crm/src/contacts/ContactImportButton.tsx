import UploadIcon from '@mui/icons-material/Upload';
import { Box, CircularProgress, Stack } from '@mui/material';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as Papa from 'papaparse';
import { useState } from 'react';
import {
    Button,
    FileField,
    FileInput,
    Form,
    useDataProvider,
    useGetIdentity,
    useNotify,
    useRefresh,
} from 'react-admin';
import { Link } from 'react-router-dom';
import * as sampleCsv from './contacts_export.csv?raw';
import { ContentImportSchema, useContactImport } from './useContactImport';

const SAMPLE_URL = `data:text/csv;charset=utf-8,${encodeURIComponent(sampleCsv.default)}`;

export const ContactImportButton = () => {
    const refresh = useRefresh();
    const user = useGetIdentity();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const contactImports = useContactImport();

    const [file, setFile] = useState<File | null>(null);

    const [importState, setImportState] = useState<
        'hidden' | 'idle' | 'running' | 'error' | 'complete'
    >('hidden');

    const [errorCount, setErrorCount] = useState(0);
    const [importCount, setImportCount] = useState(0);

    const handleOpenModal = () => {
        setImportState('idle');
        setErrorCount(0);
        setImportCount(0);
    };

    const handleCancel = () => {
        setImportState('hidden');
    };

    const handleFileChange = (file: File | null) => {
        setFile(file);
    };

    const startImport = async () => {
        if (!file) {
            return;
        }

        setImportState('running');

        Papa.parse<ContentImportSchema>(file, {
            header: true,
            skipEmptyLines: true,
            async step(row, parser) {
                // We pause the parser to avoid processing the next row until the current one is done
                // Otherwise completed will be called before the last row is processed
                parser.pause();

                try {
                    if (row.errors.length > 0) {
                        throw row.errors[0];
                    }

                    const tagNames = (row.data.tags ?? '')
                        .split(',')
                        .map((tag: string) => tag.trim())
                        .filter((tag: string) => tag);

                    const company = await contactImports.getCompany(
                        row.data.company
                    );
                    const tags = await contactImports.getTags(tagNames);

                    const {
                        first_name,
                        last_name,
                        gender,
                        title,
                        email,
                        phone_number1,
                        phone_number2,
                        background,
                        acquisition,
                        first_seen,
                        last_seen,
                        has_newsletter,
                        status,
                    } = row.data;

                    await dataProvider.create('contacts', {
                        data: {
                            first_name,
                            last_name,
                            gender,
                            title,
                            email,
                            phone_number1,
                            phone_number2,
                            background,
                            acquisition,
                            first_seen: new Date(first_seen),
                            last_seen: new Date(last_seen),
                            has_newsletter:
                                has_newsletter.toLowerCase() === 'true',
                            status,
                            company_id: company.id,
                            tags: tags.map(tag => tag.id),
                            sales_id: user?.identity?.id,
                        },
                    });
                    setImportCount(importCount => importCount + 1);
                } catch (error) {
                    console.error('Failed to import row', error);
                    setErrorCount(errorCount => errorCount + 1);
                } finally {
                    // We resume the parser to process the next row
                    setTimeout(() => parser.resume(), 0);
                }
            },
            error: error => {
                console.error(
                    'An error occurred while importing the file',
                    error
                );

                setImportState('error');
                notify('An error occurred while importing the file', {
                    type: 'error',
                });
            },
            complete: async () => {
                setImportState('complete');
                refresh();
            },
        });
    };

    return (
        <>
            <Button
                startIcon={<UploadIcon />}
                label="Import"
                onClick={handleOpenModal}
            />

            <Dialog open={importState !== 'hidden'} maxWidth="lg" fullWidth>
                <DialogTitle>Import</DialogTitle>
                <DialogContent>
                    <Form>
                        <Stack spacing={2}>
                            {importState === 'running' && (
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
                                    Import is running, please do not close this
                                    tab
                                </Alert>
                            )}

                            {importState === 'complete' && (
                                <Alert severity="success" variant="outlined">
                                    Contacts import complete
                                </Alert>
                            )}

                            {importState === 'error' && (
                                <Alert severity="error" variant="outlined">
                                    Failed to import this file, please make sure
                                    your provided a valid CSV file
                                </Alert>
                            )}
                            {importState === 'idle' ? (
                                <>
                                    <Alert
                                        severity="info"
                                        action={
                                            <Button
                                                component={Link}
                                                label="Download CSV sample"
                                                color="info"
                                                to={SAMPLE_URL}
                                                target="_blank"
                                            />
                                        }
                                    >
                                        Here is a sample CSV file you can use as
                                        a template
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
                            ) : (
                                <>
                                    <Alert severity="success">
                                        Imported {importCount} contacts
                                    </Alert>
                                    {errorCount > 0 && (
                                        <Alert severity="error">
                                            Encountered {errorCount} errors
                                        </Alert>
                                    )}
                                </>
                            )}
                        </Stack>
                    </Form>
                </DialogContent>
                <DialogActions>
                    {importState === 'idle' ? (
                        <>
                            <Button label="Cancel" onClick={handleCancel} />
                            <Button
                                label="Import"
                                variant="contained"
                                onClick={startImport}
                                disabled={!file || importState !== 'idle'}
                            />
                        </>
                    ) : (
                        <Button
                            label="Close"
                            onClick={handleCancel}
                            disabled={importState === 'running'}
                        />
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

export function toDataUrl(content: string, mimeType: string) {
    return `data:${mimeType},${encodeURIComponent(content)}`;
}
