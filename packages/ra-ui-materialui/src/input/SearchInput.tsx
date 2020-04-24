import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import SearchIcon from '@material-ui/icons/Search';
import { InputAdornment } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';
import { useTranslate, InputProps } from 'ra-core';

import TextInput from './TextInput';

const SearchInput: FunctionComponent<
    InputProps<TextFieldProps> & Omit<TextFieldProps, 'label' | 'helperText'>
> = props => {
    const { classes: classesOverride, ...rest } = props;
    const translate = useTranslate();

    return (
        <TextInput
            label="Search"
            resettable
            placeholder={translate('ra.action.search')}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <SearchIcon color="disabled" />
                    </InputAdornment>
                ),
            }}
            {...rest}
        />
    );
};

SearchInput.propTypes = {
    classes: PropTypes.object,
};

export default SearchInput;
