import React from 'react';
import ChipInput from 'material-ui-chip-input';
import { withStyles } from '@material-ui/core/styles';

const chipInputStyles = {
    label: {
        top: 18,
    },
    labelShrink: {
        top: 8,
    },
    chipContainer: {
        alignItems: 'center',
        display: 'flex',
        minHeight: 50,
    },
};

const AutocompleteArrayInputChip = props => <ChipInput {...props} />;

export default withStyles(chipInputStyles)(AutocompleteArrayInputChip);
