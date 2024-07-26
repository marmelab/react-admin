import Typography from '@mui/material/Typography';
import { Link, RecordContextProvider } from 'react-admin';
import { CompanyAvatar } from '../companies/CompanyAvatar';
import type { ActivityDealNoteCreated } from '../types';
import { ActivityLogDate } from './ActivityLogDate';
import { ActivityLogNote } from './ActivityLogNote';

type ActivityLogDealNoteCreatedProps = {
    activity: ActivityDealNoteCreated;
};

export function ActivityLogDealNoteCreated({
    activity: { company, sale, deal, dealNote },
}: ActivityLogDealNoteCreatedProps) {
    return (
        <RecordContextProvider value={company}>
            <ActivityLogNote
                header={
                    <>
                        <CompanyAvatar />
                        <Typography
                            component="p"
                            sx={{
                                flexGrow: 1,
                            }}
                            variant="body2"
                        >
                            A note has been added to{' '}
                            <Link to={`/deals/${deal.id}/show`} variant="body2">
                                {deal.name}
                            </Link>{' '}
                            from <strong>{company.name}</strong> by{' '}
                            {sale.first_name} {sale.last_name}
                        </Typography>

                        <ActivityLogDate date={dealNote.date} />
                    </>
                }
                text={dealNote.text}
            />
        </RecordContextProvider>
    );
}
