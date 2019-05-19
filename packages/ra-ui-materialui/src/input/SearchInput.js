import React from 'react';
import PropTypes from 'prop-types';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { useTranslate } from 'ra-core';

import TextInput from './TextInput';

const searchFilterStyles = createStyles({
    input: {
        marginTop: 32,
    },
});

const SearchInput = ({ classes, ...props }) => {
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

SearchInput.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(searchFilterStyles)(SearchInput);
