import ContentSave from '@mui/icons-material/Save';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import { FormEvent, useEffect, useState } from 'react';
import { Toolbar } from 'react-admin';
import { DialogCloseButton } from '../misc/DialogCloseButton';
import { Tag } from '../types';
import { colors } from './colors';
import { RoundButton } from './RoundButton';

type TagDialogProps = {
    open: boolean;
    tag?: Pick<Tag, 'name' | 'color'>;
    title: string;
    onSubmit(tag: Pick<Tag, 'name' | 'color'>): Promise<void>;
    onClose(): void;
};

export function TagDialog({
    open,
    tag,
    title,
    onClose,
    onSubmit,
}: TagDialogProps) {
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState(colors[0]);
    const [disabled, setDisabled] = useState(false);

    const handleNewTagNameChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setNewTagName(event.target.value);
    };

    const handleClose = () => {
        setDisabled(false);
        onClose();
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await onSubmit({ name: newTagName, color: newTagColor });

        setDisabled(true);
        setNewTagName('');
        setNewTagColor(colors[0]);

        handleClose();
    };

    useEffect(() => {
        setNewTagName(tag?.name ?? '');
        setNewTagColor(tag?.color ?? colors[0]);
    }, [tag]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
        >
            <form onSubmit={handleSubmit}>
                <DialogCloseButton onClose={handleClose} />
                <DialogTitle id="form-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        label="Tag name"
                        value={newTagName}
                        onChange={handleNewTagNameChange}
                        sx={{ mt: 1 }}
                    />
                    <Box display="flex" flexWrap="wrap" width={230} mt={2}>
                        {colors.map(color => (
                            <RoundButton
                                key={color}
                                color={color}
                                selected={color === newTagColor}
                                handleClick={() => {
                                    setNewTagColor(color);
                                }}
                            />
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions
                    sx={{
                        justifyContent: 'flex-start',
                        p: 0,
                    }}
                >
                    <Toolbar
                        sx={{
                            width: '100%',
                        }}
                    >
                        <Button
                            type="submit"
                            color="primary"
                            disabled={disabled}
                            variant="contained"
                            startIcon={<ContentSave />}
                        >
                            Save
                        </Button>
                    </Toolbar>
                </DialogActions>
            </form>
        </Dialog>
    );
}
