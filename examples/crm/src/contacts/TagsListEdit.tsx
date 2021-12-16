import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useState, FormEvent } from 'react';
import {
    useGetMany,
    useCreate,
    useUpdate,
    useGetList,
    Identifier,
} from 'react-admin';
import {
    Chip,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Menu,
} from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import EditIcon from '@mui/icons-material/Edit';

import { colors } from '../tags/colors';
import { Contact } from '../types';

export const TagsListEdit = ({ record }: { record: Contact }) => {
    const [open, setOpen] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState(colors[0]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [disabled, setDisabled] = useState(false);

    const { data: allTags, refetch, isLoading: isLoadingAllTags } = useGetList(
        'tags',
        {
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'name', order: 'ASC' },
        }
    );
    const { data: tags, isLoading: isLoadingRecordTags } = useGetMany(
        'tags',
        { ids: record.tags },
        {
            enabled: record.tags && record.tags.length > 0,
        }
    );
    const [update] = useUpdate();
    const [create] = useCreate();

    const unselectedTags =
        allTags && allTags.filter(tag => !record.tags.includes(tag.id));

    const handleOpen = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteTag = (id: Identifier) => {
        const tags: Identifier[] = record.tags.filter(
            (tagId: Identifier) => tagId !== id
        );
        update('contacts', {
            id: record.id,
            data: { tags },
            previousData: record,
        });
    };

    const handleAddTag = (id: Identifier) => {
        const tags: Identifier[] = [...record.tags, id];
        update('contacts', {
            id: record.id,
            data: { tags },
            previousData: record,
        });
        setAnchorEl(null);
    };

    const handleOpenCreateDialog = () => {
        setOpen(true);
        setAnchorEl(null);
        setDisabled(false);
    };

    const handleNewTagNameChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setNewTagName(event.target.value);
    };

    const handleCreateTag = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setDisabled(true);
        create(
            'tags',
            { name: newTagName, color: newTagColor },
            {
                onSuccess: ({ data }) => {
                    update(
                        'contacts',
                        {
                            id: record.id,
                            data: { tags: [...record.tags, data.id] },
                            previousData: record,
                        },
                        {
                            onSuccess: () => {
                                setNewTagName('');
                                setNewTagColor(colors[0]);
                                setOpen(false);

                                refetch();
                            },
                        }
                    );
                },
            }
        );
    };

    if (!isLoadingRecordTags || isLoadingAllTags) return null;
    return (
        <>
            {tags?.map(tag => (
                <Box mt={1} mb={1} key={tag.id}>
                    <Chip
                        size="small"
                        variant="outlined"
                        onDelete={() => handleDeleteTag(tag.id)}
                        label={tag.name}
                        style={{ backgroundColor: tag.color, border: 0 }}
                    />
                </Box>
            ))}
            <Box mt={1}>
                <Chip
                    icon={<ControlPointIcon />}
                    size="small"
                    variant="outlined"
                    onClick={handleOpen}
                    label="Add tag"
                    color="primary"
                />
            </Box>
            <Menu
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorEl={anchorEl}
            >
                {unselectedTags?.map(tag => (
                    <MenuItem key={tag.id} onClick={() => handleAddTag(tag.id)}>
                        <Chip
                            size="small"
                            variant="outlined"
                            label={tag.name}
                            style={{
                                backgroundColor: tag.color,
                                border: 0,
                            }}
                            onClick={() => handleAddTag(tag.id)}
                        />
                    </MenuItem>
                ))}
                <MenuItem onClick={handleOpenCreateDialog}>
                    <Chip
                        icon={<EditIcon />}
                        size="small"
                        variant="outlined"
                        onClick={handleOpenCreateDialog}
                        color="primary"
                        label="Create new tag"
                    />
                </MenuItem>
            </Menu>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="form-dialog-title"
            >
                <form onSubmit={handleCreateTag}>
                    <DialogTitle id="form-dialog-title">
                        Create a new tag
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            label="Tag name"
                            fullWidth
                            value={newTagName}
                            onChange={handleNewTagNameChange}
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
                    <DialogActions>
                        <Button onClick={() => setOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color="primary"
                            disabled={disabled}
                        >
                            Add tag
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

const PREFIX = 'TagsListEdit';

const classes = {
    root: `${PREFIX}-root`,
};

const StyledRoundButton = styled('button')({
    [`&.${classes.root}`]: {
        width: 30,
        height: 30,
        borderRadius: 15,
        display: 'inline-block',
        margin: 8,
    },
});

const RoundButton = ({ color, handleClick, selected }: any) => (
    <StyledRoundButton
        type="button"
        className={classes.root}
        style={{
            backgroundColor: color,
            border: selected ? '2px solid grey' : 'none',
        }}
        onClick={handleClick}
    />
);
