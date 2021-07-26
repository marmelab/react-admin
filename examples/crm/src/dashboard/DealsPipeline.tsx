import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card, Link, Box } from '@material-ui/core';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import {
    useGetList,
    SimpleList,
    useGetIdentity,
    ReferenceField,
    Identifier,
} from 'react-admin';

import { CompanyAvatar } from '../companies/CompanyAvatar';
import { stages, stageNames } from '../deals/stages';
import { Deal } from '../types';

export const DealsPipeline = () => {
    const { identity } = useGetIdentity();
    const { data, ids: unorderedIds, total, loaded } = useGetList<Deal>(
        'deals',
        { page: 1, perPage: 10 },
        { field: 'last_seen', order: 'DESC' },
        { stage_neq: 'lost', sales_id: identity?.id },
        { enabled: Number.isInteger(identity?.id) }
    );
    const [ids, setIds] = useState(unorderedIds);
    useEffect(() => {
        const deals = unorderedIds.map(id => data[id]);
        const orderedIds: Identifier[] = [];
        stages
            .filter(stage => stage !== 'won')
            .forEach(stage =>
                deals
                    .filter(deal => deal.stage === stage)
                    .forEach(deal => orderedIds.push(deal.id))
            );
        setIds(orderedIds);
    }, [unorderedIds, data]);
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
                    basePath="/deals"
                    linkType="show"
                    ids={ids}
                    data={data}
                    total={total}
                    loaded={loaded}
                    primaryText={deal => deal.name}
                    secondaryText={deal =>
                        `${deal.amount.toLocaleString('en-US', {
                            notation: 'compact',
                            style: 'currency',
                            currency: 'USD',
                            currencyDisplay: 'narrowSymbol',
                            minimumSignificantDigits: 3,
                            // @ts-ignore
                        })} , ${stageNames[deal.stage]}`
                    }
                    leftAvatar={deal => (
                        <ReferenceField
                            source="company_id"
                            record={deal}
                            reference="companies"
                            resource="deals"
                            basePath="/deals"
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
