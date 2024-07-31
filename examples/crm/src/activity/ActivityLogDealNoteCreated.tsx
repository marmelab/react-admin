import Typography from '@mui/material/Typography';
import { Link } from 'react-admin';

import { CompanyAvatar } from '../companies/CompanyAvatar';
import type { ActivityDealNoteCreated } from '../types';
import { SaleName } from '../sales/SaleName';
import { ActivityLogNote } from './ActivityLogNote';
import { ActivityLogDate } from './ActivityLogDate';
import { useActivityLogContext } from './ActivityLogContext';

type ActivityLogDealNoteCreatedProps = {
    activity: ActivityDealNoteCreated;
};

export function ActivityLogDealNoteCreated({
    activity: { company, sale, deal, dealNote },
}: ActivityLogDealNoteCreatedProps) {
    const context = useActivityLogContext();
    return (
        <ActivityLogNote
            header={
                <>
                    <CompanyAvatar width={20} height={20} record={company} />
                    <Typography
                        component="p"
                        variant="body2"
                        color="text.secondary"
                        flexGrow={1}
                    >
                        <SaleName sale={sale} /> added a note about deal{' '}
                        <Link to={`/deals/${deal.id}/show`}>{deal.name}</Link>
                        {context !== 'company' && (
                            <>
                                {' at '}
                                <Link to={`/companies/${deal.company_id}/show`}>
                                    {company.name}
                                </Link>{' '}
                                <ActivityLogDate date={dealNote.date} />
                            </>
                        )}
                    </Typography>
                    {context === 'company' && (
                        <ActivityLogDate date={dealNote.date} />
                    )}
                </>
            }
            text={dealNote.text}
        />
    );
}
