import UploadIcon from '@mui/icons-material/Upload';
import { useState } from 'react';
import { Button } from 'react-admin';
import { ContactImportDialog } from './ContactImportDialog';

export const ContactImportButton = () => {
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <>
            <Button
                startIcon={<UploadIcon />}
                label="Import"
                onClick={handleOpenModal}
            />
            <ContactImportDialog open={modalOpen} onClose={handleCloseModal} />
        </>
    );
};
