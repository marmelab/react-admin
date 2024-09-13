import { Typography } from '@mui/material';
import { ReferenceField } from 'react-admin';

import { Avatar } from '../contacts/Avatar';
import type { ActivityContactNoteCreated } from '../types';
import { SaleName } from '../sales/SaleName';
import { ActivityLogNote } from './ActivityLogNote';
import { RelativeDate } from '../misc/RelativeDate';
import { useActivityLogContext } from './ActivityLogContext';

type ActivityLogContactNoteCreatedProps = {
    activity: ActivityContactNoteCreated;
};

export function ActivityLogContactNoteCreated({
    activity,
}: ActivityLogContactNoteCreatedProps) {
    const context = useActivityLogContext();
    const { contactNote } = activity;
    return (
        <ActivityLogNote
            header={
                <>
                    <ReferenceField
                        source="contact_id"
                        reference="contacts"
                        record={contactNote}
                        link={false}
                    >
                        <Avatar width={20} height={20} />
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
                        added a note about{' '}
                        <ReferenceField
                            source="contact_id"
                            reference="contacts"
                            record={contactNote}
                        />
                        {context !== 'company' && (
                            <>
                                {' from '}
                                <ReferenceField
                                    source="contact_id"
                                    reference="contacts"
                                    record={contactNote}
                                    link={false}
                                >
                                    <ReferenceField
                                        source="company_id"
                                        reference="companies"
                                        link="show"
                                    />
                                </ReferenceField>{' '}
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
                </>
            }
            text={contactNote.text}
        />
    );
}
