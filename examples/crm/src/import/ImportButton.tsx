import UploadIcon from '@mui/icons-material/Upload';
import { Stack } from '@mui/material';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { Button, FileField, FileInput, Form } from 'react-admin';
import { Link } from 'react-router-dom';

type ImportButtonProps = {
    sampleUrl?: string;
};

export const ImportButton = ({ sampleUrl }: ImportButtonProps) => {
    const [isModalOpen, setModalOpen] = useState(true);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCancel = () => {
        setModalOpen(false);
    };

    const startImport = () => {
        console.log('starting import');
    };

    return (
        <>
            <Button
                startIcon={<UploadIcon />}
                label="Import"
                onClick={handleOpenModal}
            />

            <Dialog open={isModalOpen} maxWidth="lg" fullWidth>
                <DialogTitle>Import</DialogTitle>
                <DialogContent>
                    <Form>
                        <Stack spacing={2}>
                            {sampleUrl && (
                                <Alert
                                    severity="success"
                                    action={
                                        <Button
                                            component={Link}
                                            label="Download CSV sample"
                                            color="success"
                                            to={sampleUrl}
                                            target="_blank"
                                        />
                                    }
                                >
                                    Here is a sample CSV file you can use as a
                                    template
                                </Alert>
                            )}

                            <FileInput
                                source="csv"
                                label="CSV File"
                                accept={{ 'text/csv': ['.csv'] }}
                            >
                                <FileField source="src" title="title" />
                            </FileInput>
                        </Stack>
                    </Form>
                </DialogContent>
                <DialogActions>
                    <Button label="Cancel" onClick={handleCancel} />
                    <Button label="Import" onClick={startImport} />
                </DialogActions>
            </Dialog>
        </>
    );
};

export function toDataUrl(content: string, mimeType: string) {
    return `data:${mimeType},${encodeURIComponent(content)}`;
}
