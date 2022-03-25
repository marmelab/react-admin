import * as React from 'react';
import { useState } from 'react';
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

const TagReferenceInput = ({
    ...props
}: {
    reference: string;
    source: string;
    label?: string;
}) => {
    const { setValue } = useFormContext();
    const [published, setPublished] = useState(true);
    const [locale] = useLocaleState();

    const handleChangePublishedFilter = () => {
        setPublished(prev => !prev);
        setValue('tags', []);
    };

    return (
        <ReferenceArrayInput {...props} perPage={5} filter={{ published }}>
            <AutocompleteArrayInput
                create={<CreateTag />}
                optionText={`name.${locale}`}
            />
        </ReferenceArrayInput>
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
