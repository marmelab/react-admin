/* eslint-disable import/no-anonymous-default-export */
import * as React from 'react';
import {
    FilterList,
    FilterLiveSearch,
    FilterListItem,
    useGetIdentity,
} from 'react-admin';
import { Box } from '@material-ui/core';
import BusinessIcon from '@material-ui/icons/Business';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';

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
