import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withStyles } from '@material-ui/core/styles';
import { translate } from 'ra-core';

import TextInput from './TextInput';

const searchFilterStyles = {
    input: {
        'label + &': { marginTop: 0 },
    },
};

const SearchInput = ({ classes, translate, ...props }) => (
    <TextInput
        label={false}
        placeholder={translate('ra.action.search')}
        InputProps={{
            endAdornment: (
                <InputAdornment position="end">
                    <SearchIcon color="disabled" />
                </InputAdornment>
            ),
            classes: { formControl: classes.input },
        }}
        {...props}
    />
);

SearchInput.propTypes = {
    classes: PropTypes.object,
    translate: PropTypes.func,
};

const enhance = compose(
    translate,
    withStyles(searchFilterStyles)
);

export default enhance(SearchInput);
