import * as React from 'react';
import {
    AutocompleteInput,
    DateInput,
    ReferenceInput,
    SearchInput,
    SelectInput,
} from 'react-admin';
import green from '@mui/material/colors/green';
import orange from '@mui/material/colors/orange';
import red from '@mui/material/colors/red';
import { Box } from '@mui/material';

import { Customer } from '../types';

const colorMap: { [key: string]: string } = {
    accepted: green[500],
    pending: orange[500],
    rejected: red[500],
};

const reviewFilters = [
    <SearchInput source="q" alwaysOn />,
    <SelectInput
        source="status"
        choices={[
            { id: 'accepted', name: 'Accepted' },
            { id: 'pending', name: 'Pending' },
            { id: 'rejected', name: 'Rejected' },
        ]}
        optionText={choice => (
            <>
                <Box
                    bgcolor={colorMap[choice.id]}
                    width={8}
                    height={8}
                    borderRadius={4}
                    component="span"
                    mr={1}
                    display="inline-block"
                />
                {choice.name}
            </>
        )}
    />,
    <ReferenceInput source="customer_id" reference="customers">
        <AutocompleteInput
            optionText={(choice?: Customer) =>
                choice?.id // the empty choice is { id: '' }
                    ? `${choice.first_name} ${choice.last_name}`
                    : ''
            }
            sx={{ minWidth: 200 }}
        />
    </ReferenceInput>,
    <ReferenceInput source="product_id" reference="products">
        <AutocompleteInput optionText="reference" />
    </ReferenceInput>,
    <DateInput source="date_gte" />,
    <DateInput source="date_lte" />,
];

export default reviewFilters;
