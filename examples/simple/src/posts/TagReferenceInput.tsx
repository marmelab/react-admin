import * as React from 'react';
import { useCallback, useState } from 'react';
import {
    AutocompleteArrayInput,
    ReferenceArrayInput,
    useCreate,
    useCreateSuggestionContext,
    useLocaleState,
} from 'react-admin';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    TextField as MuiTextField,
} from '@mui/material';
import { useFormContext } from 'react-hook-form';

const useTagsFilterToQuery = () => {
    const [locale] = useLocaleState();
    return useCallback(
        (filter: string) =>
            filter
                ? {
                      [`name.${locale}_q`]: filter,
                  }
                : {},
        [locale]
    );
};

const TagReferenceInput = ({
    ...props
}: {
    reference: string;
    source: string;
    label?: string;
}) => {
    const { setValue } = useFormContext();
    const [filter, setFilter] = useState({ published: true });
    const filterToQuery = useTagsFilterToQuery();
    const [locale] = useLocaleState();

    const handleAddFilter = () => {
        setFilter(prev => ({ published: !prev.published }));
        setValue('tags', []);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                width: '50%',
            }}
        >
            <ReferenceArrayInput
                {...props}
                filter={filter}
                filterToQuery={filterToQuery}
            >
                <AutocompleteArrayInput
                    create={<CreateTag />}
                    optionText={`name.${locale}`}
                />
            </ReferenceArrayInput>
            <Button
                name="change-filter"
                sx={{ margin: '0 24px', position: 'relative' }}
                onClick={handleAddFilter}
            >
                Filter {filter ? 'Unpublished' : 'Published'} Tags
            </Button>
        </Box>
    );
};

const CreateTag = () => {
    const { filter, onCancel, onCreate } = useCreateSuggestionContext();
    const [value, setValue] = React.useState(filter || '');
    const [create] = useCreate();
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        create(
            'tags',
            { data: { name: { en: value } } },

            {
                onSuccess: data => {
                    setValue('');
                    const choice = data;
                    onCreate(choice);
                },
            }
        );
        return false;
    };
    return (
        <Dialog open onClose={onCancel}>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <MuiTextField
                        label="New tag"
                        value={value}
                        onChange={event => setValue(event.target.value)}
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="submit">Save</Button>
                    <Button onClick={onCancel}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default TagReferenceInput;
