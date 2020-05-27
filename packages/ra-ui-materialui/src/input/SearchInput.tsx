import * as React from 'react';
import { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles, InputAdornment } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';
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

const SearchInput: FunctionComponent<
    InputProps<TextFieldProps> & Omit<TextFieldProps, 'label' | 'helperText'>
> = props => {
    const { classes: classesOverride, ...rest } = props;
    const translate = useTranslate();
    const classes = useStyles(props);

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

export default SearchInput;
