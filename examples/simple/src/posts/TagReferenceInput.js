import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-final-form';
import { AutocompleteArrayInput, ReferenceArrayInput } from 'react-admin';
import Button from '@material-ui/core/Button';
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

const TagReferenceInput = ({ ...props }) => {
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
                <AutocompleteArrayInput />
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

export default TagReferenceInput;
