import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card, Link, Box } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import {
    useGetList,
    SimpleList,
    useGetIdentity,
    ReferenceField,
} from 'react-admin';

import { CompanyAvatar } from '../companies/CompanyAvatar';
import { stages, stageNames } from '../deals/stages';
import { Deal } from '../types';

export const DealsPipeline = () => {
    const { identity } = useGetIdentity();
    const { data, total, isLoading } = useGetList<Deal>(
        'deals',
        {
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'last_seen', order: 'DESC' },
            filter: { stage_neq: 'lost', sales_id: identity?.id },
        },
        { enabled: Number.isInteger(identity?.id) }
    );

    const getOrderedDeals = (data?: Deal[]): Deal[] | undefined => {
        if (!data) {
            return;
        }
        const deals: Deal[] = [];
        stages
            .filter(stage => stage !== 'won')
            .forEach(stage =>
                data
                    .filter(deal => deal.stage === stage)
                    .forEach(deal => deals.push(deal))
            );
        return deals;
    };

    return (
        <>
            <Box display="flex" alignItems="center" marginBottom="1em">
                <Box ml={2} mr={2} display="flex">
                    <MonetizationOnIcon color="disabled" fontSize="large" />
                </Box>
                <Link
                    underline="none"
                    variant="h5"
                    color="textSecondary"
                    component={RouterLink}
                    to="/deals"
                >
                    Deals Pipeline
                </Link>
            </Box>
            <Card>
                <SimpleList<Deal>
                    resource="deals"
                    linkType="show"
                    data={getOrderedDeals(data)}
                    total={total}
                    isLoading={isLoading}
                    primaryText={(deal: Deal) => deal.name}
                    secondaryText={(deal: Deal) =>
                        `${deal.amount.toLocaleString('en-US', {
                            notation: 'compact',
                            style: 'currency',
                            currency: 'USD',
                            currencyDisplay: 'narrowSymbol',
                            minimumSignificantDigits: 3,
                            // @ts-ignore
                        })} , ${stageNames[deal.stage]}`
                    }
                    leftAvatar={(deal: Deal) => (
                        <ReferenceField
                            source="company_id"
                            record={deal}
                            reference="companies"
                            resource="deals"
                            link={false}
                        >
                            <CompanyAvatar size="small" />
                        </ReferenceField>
                    )}
                />
            </Card>
        </>
    );
};
