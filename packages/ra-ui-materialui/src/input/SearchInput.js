import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useTranslate } from 'ra-core';

import TextInput from './TextInput';

const useStyles = makeStyles(
    createStyles({
        input: {
            marginTop: 32,
        },
    })
);

const SearchInput = props => {
    const classes = useStyles();
    const translate = useTranslate();

    return (
        <TextInput
            label={false}
            placeholder={translate('ra.action.search')}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <SearchIcon color="disabled" />
                    </InputAdornment>
                ),
            }}
            className={classes.input}
            {...props}
        />
    );
};

export default SearchInput;
