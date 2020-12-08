import * as React from 'react';
import { FC, ChangeEvent, memo, useRef } from 'react';
import { InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { Form } from 'react-final-form';
import { useTranslate, useListFilterContext } from 'ra-core';
import { get, set, merge } from 'lodash';

import TextInput from '../../input/TextInput';

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
const FilterLiveSearch: FC<{ source?: string; label?: string }> = props => {
    const { source = 'q', label, ...rest } = props;

    const { filterValues, setFilters } = useListFilterContext();
    const translate = useTranslate();
    const formRef = useRef<any>(null);

    // clear the form when the correspondind <Filter> is removed
    if (!get(filterValues, source)) {
        if (formRef.current) {
            formRef.current.reset();
        }
    }
    const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target) {
            const { values } = formRef.current.getState(); // get parsed value
            const query = merge({}, filterValues, values);
            setFilters(query, null);
        } else {
            const cleanedFilter = set(filterValues, source, null);
            setFilters(cleanedFilter, null);
        }
    };

    const onSubmit = () => undefined;

    return (
        <Form onSubmit={onSubmit}>
            {({ form }) => {
                formRef.current = form;
                return (
                    <TextInput
                        resettable
                        helperText={false}
                        source={source}
                        label={
                            (label && translate(label)) ||
                            translate('ra.action.search')
                        }
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon color="disabled" />
                                </InputAdornment>
                            ),
                        }}
                        onChange={onSearchChange}
                        {...rest}
                    />
                );
            }}
        </Form>
    );
};

export default memo(FilterLiveSearch);
