import React from 'react';
import ChipInput from 'material-ui-chip-input';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
    createStyles({
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
    })
);

const AutocompleteArrayInputChip = props => {
    const classes = useStyles();

    return <ChipInput classes={classes} {...props} />;
};

export default AutocompleteArrayInputChip;
