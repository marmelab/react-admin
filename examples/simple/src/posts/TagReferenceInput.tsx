import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-final-form';
import {
    AutocompleteArrayInput,
    ReferenceArrayInput,
    useCreate,
    useCreateSuggestionContext,
} from 'react-admin';
import {
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    TextField as MuiTextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    button: {
        margin: '0 24px',
        position: 'relative',
    },
    input: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '50%',
    },
});

const TagReferenceInput = ({
    ...props
}: {
    reference: string;
    source: string;
    label?: string;
}) => {
    const classes = useStyles();
    const { change } = useForm();
    const [filter, setFilter] = useState(true);

    const handleAddFilter = () => {
        setFilter(!filter);
        change('tags', []);
    };

    return (
        <div className={classes.input}>
            <ReferenceArrayInput {...props} filter={{ published: filter }}>
                <AutocompleteArrayInput
                    create={<CreateTag />}
                    optionText="name.en"
                />
            </ReferenceArrayInput>
            <Button
                name="change-filter"
                className={classes.button}
                onClick={handleAddFilter}
            >
                Filter {filter ? 'Unpublished' : 'Published'} Tags
            </Button>
        </div>
    );
};

const CreateTag = () => {
    const { filter, onCancel, onCreate } = useCreateSuggestionContext();
    const [value, setValue] = React.useState(filter || '');
    const [create] = useCreate('tags');
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        create(
            {
                payload: {
                    data: {
                        name: {
                            en: value,
                        },
                    },
                },
            },
            {
                onSuccess: ({ data }) => {
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
