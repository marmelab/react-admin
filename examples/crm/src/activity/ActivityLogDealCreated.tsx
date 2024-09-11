import { ListItem, Stack, Typography } from '@mui/material';
import { Link, ReferenceField } from 'react-admin';

import { CompanyAvatar } from '../companies/CompanyAvatar';
import type { ActivityDealCreated } from '../types';
import { SaleName } from '../sales/SaleName';
import { RelativeDate } from '../misc/RelativeDate';
import { useActivityLogContext } from './ActivityLogContext';

type ActivityLogDealCreatedProps = {
    activity: ActivityDealCreated;
};

export function ActivityLogDealCreated({
    activity,
}: ActivityLogDealCreatedProps) {
    const context = useActivityLogContext();
    const { deal } = activity;
    return (
        <ListItem disableGutters>
            <Stack direction="row" spacing={1} alignItems="center" width="100%">
                <ReferenceField
                    source="company_id"
                    reference="companies"
                    record={activity}
                    link={false}
                >
                    <CompanyAvatar width={20} height={20} />
                </ReferenceField>
                <Typography
                    component="p"
                    variant="body2"
                    color="text.secondary"
                    flexGrow={1}
                >
                    <ReferenceField
                        source="sales_id"
                        reference="sales"
                        record={activity}
                        link={false}
                    >
                        <SaleName />
                    </ReferenceField>{' '}
                    added deal{' '}
                    <Link to={`/deals/${deal.id}/show`}>{deal.name}</Link>{' '}
                    {context !== 'company' && (
                        <>
                            to company{' '}
                            <ReferenceField
                                source="company_id"
                                reference="companies"
                                record={activity}
                                link="show"
                            />{' '}
                            <RelativeDate date={activity.date} />
                        </>
                    )}
                </Typography>
                {context === 'company' && (
                    <Typography
                        color="textSecondary"
                        variant="body2"
                        component="span"
                    >
                        <RelativeDate date={activity.date} />
                    </Typography>
                )}
            </Stack>
        </ListItem>
    );
}
