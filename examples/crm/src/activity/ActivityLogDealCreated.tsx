import { ListItem, Stack, Typography } from '@mui/material';
import { Link } from 'react-admin';

import { CompanyAvatar } from '../companies/CompanyAvatar';
import type { ActivityDealCreated } from '../types';
import { SaleName } from '../sales/SaleName';
import { RelativeDate } from '../misc/RelativeDate';
import { useActivityLogContext } from './ActivityLogContext';

type ActivityLogDealCreatedProps = {
    activity: ActivityDealCreated;
};

export function ActivityLogDealCreated({
    activity: { sale, deal, company },
}: ActivityLogDealCreatedProps) {
    const context = useActivityLogContext();
    return (
        <ListItem disableGutters>
            <Stack direction="row" spacing={1} alignItems="center" width="100%">
                <CompanyAvatar width={20} height={20} record={company} />
                <Typography
                    component="p"
                    variant="body2"
                    color="text.secondary"
                    flexGrow={1}
                >
                    <SaleName sale={sale} /> added deal{' '}
                    <Link to={`/deals/${deal.id}/show`}>{deal.name}</Link>{' '}
                    {context !== 'company' && (
                        <>
                            to company{' '}
                            <Link to={`/companies/${company.id}/show`}>
                                {company.name}
                            </Link>{' '}
                            <RelativeDate date={deal.created_at} />
                        </>
                    )}
                </Typography>
                {context === 'company' && (
                    <Typography
                        color="textSecondary"
                        variant="body2"
                        component="span"
                    >
                        <RelativeDate date={deal.created_at} />
                    </Typography>
                )}
            </Stack>
        </ListItem>
    );
}
