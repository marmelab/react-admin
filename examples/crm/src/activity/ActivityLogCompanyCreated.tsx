import { ListItem, Stack, Typography } from '@mui/material';
import { Link } from 'react-admin';

import { CompanyAvatar } from '../companies/CompanyAvatar';
import { SaleName } from '../sales/SaleName';
import type { ActivityCompanyCreated } from '../types';
import { ActivityLogDate } from './ActivityLogDate';
import { useActivityLogContext } from './ActivityLogContext';

type ActivityLogCompanyCreatedProps = {
    activity: ActivityCompanyCreated;
};

export function ActivityLogCompanyCreated({
    activity: { sale, company },
}: ActivityLogCompanyCreatedProps) {
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
                    <SaleName sale={sale} /> added company{' '}
                    <Link to={`/companies/${company.id}/show`}>
                        {company.name}
                    </Link>
                    {context === 'all' && (
                        <>
                            {' '}
                            <ActivityLogDate date={company.created_at} />
                        </>
                    )}
                </Typography>
                {context === 'company' && (
                    <ActivityLogDate date={company.created_at} />
                )}
            </Stack>
        </ListItem>
    );
}
