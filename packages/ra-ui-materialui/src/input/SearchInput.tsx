import * as React from 'react';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';
import { useTranslate } from 'ra-core';

import type { CommonInputProps } from './CommonInputProps';
import { TextInput, type TextInputProps } from './TextInput';

export const SearchInput = (inProps: SearchInputProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const { label, ...rest } = props;

    const translate = useTranslate();

    if (label) {
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
            size="small"
            {...rest}
        />
    );
};

export type SearchInputProps = CommonInputProps & TextInputProps;

const PREFIX = 'RaSearchInput';

const StyledTextInput = styled(TextInput, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    marginTop: 0,
});

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaSearchInput: 'root';
    }

    interface ComponentsPropsList {
        RaSearchInput: Partial<SearchInputProps>;
    }

    interface Components {
        RaSearchInput?: {
            defaultProps?: ComponentsPropsList['RaSearchInput'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaSearchInput'];
        };
    }
}
