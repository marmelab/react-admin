import * as React from 'react';
import { FC } from 'react';
import {
    AutocompleteInput,
    DateInput,
    Filter,
    ReferenceInput,
    SearchInput,
    SelectInput,
} from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import { FilterProps, ReviewStatus, Customer } from '../types';
import { Identifier } from 'ra-core';

const useFilterStyles = makeStyles({
    status: { width: 150 },
});

interface FilterParams {
    q?: string;
    status?: ReviewStatus;
    date_gte?: string;
    date_lte?: string;
    customer_id?: Identifier;
    product_id?: Identifier;
}

const ReviewFilter: FC<FilterProps<FilterParams>> = props => {
    const classes = useFilterStyles();
    return (
        <Filter {...props}>
            <SearchInput source="q" alwaysOn />
            <SelectInput
                source="status"
                choices={[
                    { id: 'accepted', name: 'Accepted' },
                    { id: 'pending', name: 'Pending' },
                    { id: 'rejected', name: 'Rejected' },
                ]}
                className={classes.status}
            />
            <ReferenceInput source="customer_id" reference="customers">
                <AutocompleteInput
                    optionText={(choice: Customer) =>
                        `${choice.first_name} ${choice.last_name}`
                    }
                />
            </ReferenceInput>
            <ReferenceInput source="product_id" reference="products">
                <AutocompleteInput optionText="reference" />
            </ReferenceInput>
            <DateInput source="date_gte" />
            <DateInput source="date_lte" />
        </Filter>
    );
};

export default ReviewFilter;
