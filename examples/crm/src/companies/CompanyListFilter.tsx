/* eslint-disable import/no-anonymous-default-export */
import * as React from 'react';
import {
    FilterList,
    FilterLiveSearch,
    FilterListItem,
    useGetIdentity,
} from 'react-admin';
import { Box } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

import { sizes } from './sizes';
import { sectors } from './sectors';

export const CompanyListFilter = () => {
    const { identity } = useGetIdentity();
    return (
        <Box width="15em" order="-1" marginRight="1em">
            <FilterLiveSearch />

            <FilterList label="Size" icon={<BusinessIcon />}>
                {sizes.map(size => (
                    <FilterListItem
                        key={size.id}
                        label={size.name}
                        value={{ size: size.id }}
                    />
                ))}
            </FilterList>

            <FilterList label="Sector" icon={<LocalShippingIcon />}>
                {sectors.map(sector => (
                    <FilterListItem
                        key={sector.id}
                        label={sector.name}
                        value={{ sector: sector.id }}
                    />
                ))}
            </FilterList>

            <FilterList
                label="Account manager"
                icon={<SupervisorAccountIcon />}
            >
                <FilterListItem
                    label="Me"
                    value={{
                        sales_id: identity && identity.id,
                    }}
                />
            </FilterList>
        </Box>
    );
};
