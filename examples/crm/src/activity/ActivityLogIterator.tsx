import { Button, List } from '@mui/material';
import { useState } from 'react';
import {
    COMPANY_CREATED,
    CONTACT_CREATED,
    CONTACT_NOTE_CREATED,
    DEAL_CREATED,
    DEAL_NOTE_CREATED,
} from '../consts';
import { Activity } from '../types';
import { ActivityLogCompanyCreated } from './ActivityLogCompanyCreated';
import { ActivityLogContactCreated } from './ActivityLogContactCreated';
import { ActivityLogContactNoteCreated } from './ActivityLogContactNoteCreated';
import { ActivityLogDealCreated } from './ActivityLogDealCreated';
import { ActivityLogDealNoteCreated } from './ActivityLogDealNoteCreated';

const PAGE_SIZE = 20;

type ActivityLogIteratorProps = {
    activities: Activity[];
};

export function ActivityLogIterator({ activities }: ActivityLogIteratorProps) {
    const [activitiesDisplayed, setActivityDisplayed] = useState(PAGE_SIZE);

    const filteredActivities = activities.slice(0, activitiesDisplayed);

    return (
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
            {filteredActivities.map(activity => (
                <ActivityItem key={activity.id} activity={activity} />
            ))}

            {activitiesDisplayed < activities.length && (
                <Button
                    onClick={() =>
                        setActivityDisplayed(
                            activitiesDisplayed =>
                                activitiesDisplayed + PAGE_SIZE
                        )
                    }
                    fullWidth
                >
                    Load more activity
                </Button>
            )}
        </List>
    );
}

function ActivityItem({ activity }: { activity: Activity }) {
    if (activity.type === COMPANY_CREATED) {
        return <ActivityLogCompanyCreated activity={activity} />;
    }

    if (activity.type === CONTACT_CREATED) {
        return <ActivityLogContactCreated activity={activity} />;
    }

    if (activity.type === CONTACT_NOTE_CREATED) {
        return <ActivityLogContactNoteCreated activity={activity} />;
    }

    if (activity.type === DEAL_CREATED) {
        return <ActivityLogDealCreated activity={activity} />;
    }

    if (activity.type === DEAL_NOTE_CREATED) {
        return <ActivityLogDealNoteCreated activity={activity} />;
    }

    return null;
}
