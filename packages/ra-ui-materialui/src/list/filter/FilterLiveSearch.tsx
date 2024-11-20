import * as React from 'react';
import { memo } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';
import { SxProps } from '@mui/system';
import { FilterLiveForm, useTranslate } from 'ra-core';

import { TextInput, TextInputProps } from '../../input';

/**
 * Form and search input for doing a full-text search filter.
 *
 * Triggers a search on change (with debounce).
 *
 * @example
 *
 * const FilterPanel = () => (
 *     <Card>
 *         <CardContent>
 *             <FilterLiveSearch source="title" />
 *         </CardContent>
 *     </Card>
 * );
 */
export const FilterLiveSearch = memo((props: FilterLiveSearchProps) => {
    const translate = useTranslate();

    const {
        source = 'q',
        label = translate('ra.action.search'),
        placeholder,
        ...rest
    } = props;

    return (
        <FilterLiveForm>
            <TextInput
                resettable
                helperText={false}
                source={source}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <SearchIcon color="disabled" />
                        </InputAdornment>
                    ),
                }}
                size="small"
                label={rest.hiddenLabel ? false : label}
                placeholder={
                    placeholder ?? (rest.hiddenLabel ? label : undefined)
                }
                {...rest}
            />
        </FilterLiveForm>
    );
});

export interface FilterLiveSearchProps extends Omit<TextInputProps, 'source'> {
    source?: string;
    sx?: SxProps;
    label?: string;
    fullWidth?: boolean;
    variant?: 'filled' | 'outlined';
}
