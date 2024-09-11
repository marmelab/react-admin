import ControlPointIcon from '@mui/icons-material/ControlPoint';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Chip, Menu, MenuItem } from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import {
    Identifier,
    useGetList,
    useGetMany,
    useRecordContext,
    useUpdate,
} from 'react-admin';

import { TagChip } from '../tags/TagChip';
import { TagCreateModal } from '../tags/TagCreateModal';
import { Contact, Tag } from '../types';

export const TagsListEdit = () => {
    const record = useRecordContext<Contact>();
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const { data: allTags, isPending: isPendingAllTags } = useGetList<Tag>(
        'tags',
        {
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'name', order: 'ASC' },
        }
    );
    const { data: tags, isPending: isPendingRecordTags } = useGetMany<Tag>(
        'tags',
        { ids: record?.tags },
        { enabled: record && record.tags && record.tags.length > 0 }
    );
    const [update] = useUpdate<Contact>();

    const unselectedTags =
        allTags &&
        record &&
        allTags.filter(tag => !record.tags.includes(tag.id));

    const handleMenuOpen = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleTagAdd = (id: Identifier) => {
        if (!record) {
            throw new Error('No contact record found');
        }
        const tags = [...record.tags, id];
        update('contacts', {
            id: record.id,
            data: { tags },
            previousData: record,
        });
        setAnchorEl(null);
    };

    const handleTagDelete = async (id: Identifier) => {
        if (!record) {
            throw new Error('No contact record found');
        }
        const tags = record.tags.filter(tagId => tagId !== id);
        await update('contacts', {
            id: record.id,
            data: { tags },
            previousData: record,
        });
    };

    const openTagCreateDialog = () => {
        setOpen(true);
        setAnchorEl(null);
    };

    const handleTagCreateClose = () => {
        setOpen(false);
    };

    const handleTagCreated = React.useCallback(
        async (tag: Tag) => {
            if (!record) {
                throw new Error('No contact record found');
            }

            await update(
                'contacts',
                {
                    id: record.id,
                    data: { tags: [...record.tags, tag.id] },
                    previousData: record,
                },
                {
                    onSuccess: () => {
                        setOpen(false);
                    },
                }
            );
        },
        [update, record]
    );

    if (isPendingRecordTags || isPendingAllTags) return null;
    return (
        <>
            {tags?.map(tag => (
                <Box mt={1} mb={1} key={tag.id}>
                    <TagChip
                        tag={tag}
                        onUnlink={() => handleTagDelete(tag.id)}
                        key={tag.id}
                    />
                </Box>
            ))}
            <Box mt={1}>
                <Chip
                    icon={<ControlPointIcon />}
                    size="small"
                    variant="outlined"
                    onClick={handleMenuOpen}
                    label="Add tag"
                    color="primary"
                />
            </Box>
            <Menu
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorEl={anchorEl}
            >
                {unselectedTags?.map(tag => (
                    <MenuItem key={tag.id} onClick={() => handleTagAdd(tag.id)}>
                        <Chip
                            size="small"
                            variant="outlined"
                            label={tag.name}
                            style={{
                                backgroundColor: tag.color,
                                border: 0,
                            }}
                            onClick={() => handleTagAdd(tag.id)}
                        />
                    </MenuItem>
                ))}
                <MenuItem onClick={openTagCreateDialog}>
                    <Chip
                        icon={<EditIcon />}
                        size="small"
                        variant="outlined"
                        onClick={openTagCreateDialog}
                        color="primary"
                        label="Create new tag"
                    />
                </MenuItem>
            </Menu>
            <TagCreateModal
                open={open}
                onClose={handleTagCreateClose}
                onSuccess={handleTagCreated}
            />
        </>
    );
};
