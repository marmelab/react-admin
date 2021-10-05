import * as React from 'react';
import PropTypes from 'prop-types';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { TextFieldProps } from '@mui/material/TextField';
import { useTranslate, InputProps } from 'ra-core';

import TextInput from './TextInput';

const useStyles = makeStyles(
    {
        input: {
            marginTop: 32,
        },
    },
    { name: 'RaSearchInput' }
);

const SearchInput = (props: SearchInputProps) => {
    const { classes: classesOverride, ...rest } = props;
    const translate = useTranslate();
    const classes = useStyles(props);
    if (props.label) {
        throw new Error(
            "<SearchInput> isn't designed to be used with a label prop. Use <TextInput> if you need a label."
        );
    }

    return (
        <TextInput
            hiddenLabel
            label=""
            resettable
            placeholder={translate('ra.action.search')}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <SearchIcon color="disabled" />
                    </InputAdornment>
                ),
            }}
            className={classes.input}
            {...rest}
        />
    );
};

SearchInput.propTypes = {
    classes: PropTypes.object,
};

export type SearchInputProps = InputProps<TextFieldProps> &
    Omit<TextFieldProps, 'label' | 'helperText'>;

export default SearchInput;
