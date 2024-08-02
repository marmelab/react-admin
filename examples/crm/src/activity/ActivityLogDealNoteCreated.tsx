import Typography from '@mui/material/Typography';
import { Link } from 'react-admin';

import { CompanyAvatar } from '../companies/CompanyAvatar';
import type { ActivityDealNoteCreated } from '../types';
import { SaleName } from '../sales/SaleName';
import { RelativeDate } from '../misc/RelativeDate';
import { ActivityLogNote } from './ActivityLogNote';
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
                                <RelativeDate date={dealNote.date} />
                            </>
                        )}
                    </Typography>
                    {context === 'company' && (
                        <Typography
                            color="textSecondary"
                            variant="body2"
                            component="span"
                        >
                            <RelativeDate date={dealNote.date} />
                        </Typography>
                    )}
                </>
            }
            text={dealNote.text}
        />
    );
}
