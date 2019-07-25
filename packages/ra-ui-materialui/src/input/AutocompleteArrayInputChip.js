import { makeStyles } from '@material-ui/core/styles';
import ChipInput from 'material-ui-chip-input';
import React from 'react';

const useStyles = makeStyles({
    label: {
        top: 18,
    },
    labelShrink: {
        top: 8,
    },
    chipContainer: {
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        minHeight: 50,
        paddingBottom: 8,
    },
    inputRoot: {
        marginTop: 8,
    },
});

const AutocompleteArrayInputChip = props => {
    const classes = useStyles();

    return <ChipInput classes={classes} {...props} />;
};

export default AutocompleteArrayInputChip;
