import * as React from 'react';
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
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import EditIcon from '@material-ui/icons/Edit';

import { colors } from '../tags/colors';
import { Contact } from '../types';

export const TagsListEdit = ({ record }: { record: Contact }) => {
    const [open, setOpen] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState(colors[0]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [version, setVersion] = useState(0); // used to force the refresh of useGetList without refreshing the whole page
    const [disabled, setDisabled] = useState(false);

    const { data: allTags, ids } = useGetList(
        'tags',
        { page: 1, perPage: 10 },
        { field: 'name', order: 'ASC' },
        {},
        { version } as any // FIXME UseDataProviderOptions don't allow [key: string]: any
    );
    const { data: tags, loaded } = useGetMany('tags', record.tags, {
        enabled: record.tags && record.tags.length > 0,
    });
    const [update] = useUpdate();
    const [create] = useCreate();

    const unselectedTagIds = ids && ids.filter(id => !record.tags.includes(id));

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
        update('contacts', record.id, { tags }, record);
    };

    const handleAddTag = (id: Identifier) => {
        const tags: Identifier[] = [...record.tags, id];
        update('contacts', record.id, { tags }, record);
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
                        record.id,
                        { tags: [...record.tags, data.id] },
                        record,
                        {
                            onSuccess: () => {
                                setNewTagName('');
                                setNewTagColor(colors[0]);
                                setOpen(false);

                                setVersion(v => v + 1);
                            },
                        }
                    );
                },
            }
        );
    };

    if (!loaded || !tags) return null;
    return (
        <>
            {tags.map(tag => (
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
                {unselectedTagIds?.map(id => (
                    <MenuItem key={id} onClick={() => handleAddTag(id)}>
                        <Chip
                            size="small"
                            variant="outlined"
                            label={allTags && allTags[id].name}
                            style={{
                                backgroundColor: allTags && allTags[id].color,
                                border: 0,
                            }}
                            onClick={() => handleAddTag(id)}
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

const useStyles = makeStyles({
    root: {
        width: 30,
        height: 30,
        borderRadius: 15,
        display: 'inline-block',
        margin: 8,
    },
});

const RoundButton = ({ color, handleClick, selected }: any) => {
    const classes = useStyles();
    return (
        <button
            type="button"
            className={classes.root}
            style={{
                backgroundColor: color,
                border: selected ? '2px solid grey' : 'none',
            }}
            onClick={handleClick}
        />
    );
};
