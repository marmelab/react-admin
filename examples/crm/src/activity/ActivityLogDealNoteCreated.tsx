import Typography from '@mui/material/Typography';
import { ReferenceField } from 'react-admin';

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
    activity,
}: ActivityLogDealNoteCreatedProps) {
    const context = useActivityLogContext();
    const { dealNote } = activity;
    return (
        <ActivityLogNote
            header={
                <>
                    <ReferenceField
                        source="deal_id"
                        reference="deals"
                        record={dealNote}
                        link={false}
                    >
                        <ReferenceField
                            source="company_id"
                            reference="companies"
                            link={false}
                        >
                            <CompanyAvatar width={20} height={20} />
                        </ReferenceField>
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
                        added a note about deal{' '}
                        <ReferenceField
                            source="deal_id"
                            reference="deals"
                            record={dealNote}
                            link="show"
                        />
                        {context !== 'company' && (
                            <>
                                {' at '}
                                <ReferenceField
                                    source="deal_id"
                                    reference="deals"
                                    record={dealNote}
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
            text={dealNote.text}
        />
    );
}
