import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const DialogCloseButton = ({ onClose }: { onClose: () => void }) => {
    return (
        <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme => theme.palette.grey[500],
            }}
        >
            <CloseIcon />
        </IconButton>
    );
};
