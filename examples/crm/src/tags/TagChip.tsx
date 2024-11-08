import { Chip } from '@mui/material';
import { useState } from 'react';
import { Tag } from '../types';
import { TagEditModal } from './TagEditModal';

type TagChipProps = {
    tag: Tag;

    onUnlink: () => Promise<void>;
};

export function TagChip({ tag, onUnlink }: TagChipProps) {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleClick = () => {
        setOpen(true);
    };

    return (
        <>
            <Chip
                size="small"
                variant="outlined"
                onDelete={onUnlink}
                label={tag.name}
                style={{ backgroundColor: tag.color, border: 0 }}
                onClick={handleClick}
            />
            <TagEditModal tag={tag} open={open} onClose={handleClose} />
        </>
    );
}
