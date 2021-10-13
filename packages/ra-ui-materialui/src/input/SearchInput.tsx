import * as React from 'react';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';
import { TextFieldProps } from '@mui/material/TextField';
import { useTranslate, InputProps } from 'ra-core';

import { TextInput } from './TextInput';

const PREFIX = 'RaSearchInput';

export const SearchInputClasses = {
    input: `${PREFIX}-input`,
};

const StyledTextInput = styled(TextInput, { name: PREFIX })({
    [`&.${SearchInputClasses.input}`]: {
        marginTop: 32,
    },
});

const SearchInput = (props: SearchInputProps) => {
    const translate = useTranslate();

    if (props.label) {
        throw new Error(
            "<SearchInput> isn't designed to be used with a label prop. Use <TextInput> if you need a label."
        );
    }

    return (
        <StyledTextInput
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
            className={SearchInputClasses.input}
            {...props}
        />
    );
};

export type SearchInputProps = InputProps<TextFieldProps> &
    Omit<TextFieldProps, 'label' | 'helperText'>;

export default SearchInput;
