import Typography from '@mui/material/Typography';
import { Link, RecordContextProvider } from 'react-admin';

import { CompanyAvatar } from '../companies/CompanyAvatar';
import type { ActivityDealNoteCreated } from '../types';
import { ActivityLogNote } from './ActivityLogNote';
import { ActivityLogSale } from './ActivityLogSale';
import { ActivityLogDate } from './ActivityLogDate';

type ActivityLogDealNoteCreatedProps = {
    activity: ActivityDealNoteCreated;
    context: 'company' | 'contact' | 'deal' | 'all';
};

export function ActivityLogDealNoteCreated({
    activity: { company, sale, deal, dealNote },
    context,
}: ActivityLogDealNoteCreatedProps) {
    return (
        <RecordContextProvider value={company}>
            <ActivityLogNote
                header={
                    <>
                        <CompanyAvatar width={20} height={20} />
                        <Typography
                            component="p"
                            sx={{
                                flexGrow: 1,
                            }}
                            variant="body2"
                            color="text.secondary"
                        >
                            <ActivityLogSale sale={sale} /> added a note about
                            deal{' '}
                            <Link to={`/deals/${deal.id}/show`} variant="body2">
                                {deal.name}
                            </Link>{' '}
                            {context !== 'company' && (
                                <>
                                    at{' '}
                                    <Link
                                        component={Link}
                                        to={`/companies/${deal.company_id}/show`}
                                        variant="body2"
                                    >
                                        {company.name}
                                    </Link>
                                </>
                            )}
                        </Typography>
                        <ActivityLogDate date={dealNote.date} />
                    </>
                }
                text={dealNote.text}
            />
        </RecordContextProvider>
    );
}
