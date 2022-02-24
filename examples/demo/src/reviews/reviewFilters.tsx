import * as React from 'react';
import {
    AutocompleteInput,
    DateInput,
    ReferenceInput,
    SearchInput,
    SelectInput,
} from 'react-admin';
import { Customer } from '../types';

const reviewFilters = [
    <SearchInput source="q" alwaysOn />,
    <SelectInput
        source="status"
        choices={[
            { id: 'accepted', name: 'Accepted' },
            { id: 'pending', name: 'Pending' },
            { id: 'rejected', name: 'Rejected' },
        ]}
    />,
    <ReferenceInput source="customer_id" reference="customers">
        <AutocompleteInput
            optionText={(choice?: Customer) =>
                choice?.id // the empty choice is { id: '' }
                    ? `${choice.first_name} ${choice.last_name}`
                    : ''
            }
        />
    </ReferenceInput>,
    <ReferenceInput source="product_id" reference="products">
        <AutocompleteInput optionText="reference" />
    </ReferenceInput>,
    <DateInput source="date_gte" />,
    <DateInput source="date_lte" />,
];

export default reviewFilters;
