import React from 'react';
import {
    AutocompleteInput,
    DateInput,
    Filter,
    ReferenceInput,
    SearchInput,
    SelectInput,
} from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

const useFilterStyles = makeStyles({
    status: { width: 150 },
});

const ReviewFilter = props => {
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
                    optionText={choice =>
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
