import { Box, List } from '@mui/material';
import { useListContext, useRecordContext } from 'react-admin';
import { ActivityCompanyCreated } from '../activity/ActivityCompanyCreated';
import { ActivityContactCreated } from '../activity/ActivityContactCreated';
import { ActivityContactNoteCreated } from '../activity/ActivityContactNoteCreated';
import { ActivityDealCreated } from '../activity/ActivityDealCreated';
import {
    COMPANY_CREATED,
    CONTACT_CREATED,
    CONTACT_NOTE_CREATED,
    DEAL_CREATED,
} from '../consts';
import { Activity, Company } from '../types';

export function CompanyActivityIterator() {
    const company = useRecordContext<Company>();
    const { data: activity, error, isPending } = useListContext<Activity>();
    if (!company || isPending || error) return null;

    return (
        <Box>
            <List
                sx={{
                    '& .MuiListItem-root': {
                        justifyContent: 'space-between',
                        gap: 2,
                    },
                    '& .MuiListItem-root:not(:first-child)': {
                        borderTop: '1px solid #f0f0f0',
                    },
                }}
            >
                {activity.map(activity => (
                    <ActivityItem
                        key={activity.id}
                        activity={activity}
                        company={company}
                    />
                ))}
            </List>
        </Box>
    );
}

function ActivityItem(props: { activity: Activity; company: Company }) {
    if (props.activity.type === COMPANY_CREATED) {
        return <ActivityCompanyCreated {...props} />;
    }

    if (props.activity.type === DEAL_CREATED) {
        return <ActivityDealCreated {...props} />;
    }

    if (props.activity.type === CONTACT_CREATED) {
        return <ActivityContactCreated {...props} />;
    }

    if (props.activity.type === CONTACT_NOTE_CREATED) {
        return <ActivityContactNoteCreated {...props} />;
    }

    return null;
}
