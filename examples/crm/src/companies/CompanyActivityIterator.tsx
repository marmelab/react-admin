import {
    Box,
    Button,
    List,
    ListItem,
    Skeleton,
    Stack,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link, useGetOne, useListContext, useRecordContext } from 'react-admin';
import {
    COMPANY_CREATED,
    CONTACT_CREATED,
    CONTACT_NOTE_CREATED,
    DEAL_CREATED,
} from '../consts';
import { Activity, Company, Contact, ContactNote, Deal, Sale } from '../types';

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

function ActivityItem({
    activity,
    company,
}: {
    activity: Activity;
    company: Company;
}) {
    switch (activity.type) {
        case COMPANY_CREATED:
            return (
                <CompanyCreatedActivity activity={activity} company={company} />
            );
        case CONTACT_CREATED:
            return (
                <ContactCreatedActivity activity={activity} company={company} />
            );
        case DEAL_CREATED:
            return (
                <DealCreatedActivity activity={activity} company={company} />
            );
        case CONTACT_NOTE_CREATED:
            return (
                <ContactNoteCreatedActivity
                    activity={activity}
                    company={company}
                />
            );
        default:
            return null;
    }
}

function DisplayDate({ date }: { date: string }) {
    const now = new Date();
    const d = new Date(date);

    if (
        d.getDay() === now.getDay() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
    ) {
        return (
            <Typography
                color="textSecondary"
                sx={{
                    minWidth: '96px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                {new Intl.DateTimeFormat('en-US', {
                    timeStyle: 'short',
                }).format(d)}
            </Typography>
        );
    }

    return (
        <Typography
            color="textSecondary"
            sx={{
                minWidth: '96px',
                display: 'flex',
                justifyContent: 'flex-end',
            }}
        >
            {new Intl.DateTimeFormat('en-US', {
                dateStyle: 'short',
            }).format(d)}
        </Typography>
    );
}

function CompanyCreatedActivity({
    activity,
    company,
}: {
    activity: Activity;
    company: Company;
}) {
    const {
        data: accountManager,
        error,
        isPending,
    } = useGetOne<Sale>('sales', { id: company.sales_id });

    if (isPending) {
        return <Skeleton />;
    }

    if (error) {
        return null;
    }

    return (
        <ListItem>
            <Typography>
                {accountManager.first_name} {accountManager.last_name} added{' '}
                <Typography component="strong" fontWeight={700}>
                    {company.name}
                </Typography>{' '}
                in companies
            </Typography>
            <DisplayDate date={activity.date} />
        </ListItem>
    );
}

function ContactCreatedActivity({
    activity,
    company,
}: {
    activity: Activity;
    company: Company;
}) {
    const {
        data: contact,
        error: contactError,
        isPending: contactIsPending,
    } = useGetOne<Contact>('contacts', { id: activity.contact_id });

    const {
        data: accountManager,
        error: saleError,
        isPending: saleIsPending,
    } = useGetOne<Sale>('sales', { id: contact?.sales_id });

    if (contactIsPending || saleIsPending) {
        return <Skeleton />;
    }

    if (contactError || saleError) {
        return null;
    }

    return (
        <ListItem>
            <Box>
                {accountManager.first_name} {accountManager.last_name} added{' '}
                <Link to={`/contacts/${contact.id}/show`}>
                    {contact.first_name} {contact.last_name}
                </Link>{' '}
                to{' '}
                <Typography component="strong" fontWeight={700}>
                    {company.name}
                </Typography>
            </Box>
            <DisplayDate date={activity.date} />
        </ListItem>
    );
}

function DealCreatedActivity({
    activity,
    company,
}: {
    activity: Activity;
    company: Company;
}) {
    const {
        data: deal,
        error: dealError,
        isPending: dealIsPending,
    } = useGetOne<Deal>('deals', { id: activity.deal_id });

    const {
        data: accountManager,
        error: saleError,
        isPending: saleIsPending,
    } = useGetOne<Sale>('sales', { id: deal?.sales_id });

    if (dealIsPending || saleIsPending) {
        return <Skeleton />;
    }

    if (dealError || saleError) {
        return null;
    }

    return (
        <ListItem>
            <Box>
                {accountManager.first_name} {accountManager.last_name} created{' '}
                the "<Link to={`/deals/${deal.id}/show`}>{deal.name}</Link>"
                deal to{' '}
                <Typography component="strong" fontWeight={700}>
                    {company.name}
                </Typography>
            </Box>
            <DisplayDate date={activity.date} />
        </ListItem>
    );
}

function ContactNoteCreatedActivity({
    activity,
    company,
}: {
    activity: Activity;
    company: Company;
}) {
    const {
        data: contactNote,
        error: contactNoteError,
        isPending: contactNoteIsPending,
    } = useGetOne<ContactNote>('contactNotes', {
        id: activity.contact_note_id,
    });

    const {
        data: accountManager,
        error: saleError,
        isPending: saleIsPending,
    } = useGetOne<Sale>('sales', { id: contactNote?.sales_id });

    const {
        data: contact,
        error: contactError,
        isPending: contactIsPending,
    } = useGetOne<Contact>('contacts', { id: contactNote?.contact_id });

    const [seeMore, setSeeMore] = useState(false);

    if (contactNoteIsPending || saleIsPending || contactIsPending) {
        return <Skeleton />;
    }

    if (contactNoteError || saleError || contactError) {
        return null;
    }

    const maxDisplayLength = 450;

    const slicedNote =
        contactNote.text.length > maxDisplayLength
            ? contactNote.text.slice(0, maxDisplayLength)
            : null;

    return (
        <ListItem>
            <Stack gap={1}>
                <Box>
                    {accountManager.first_name} {accountManager.last_name} added{' '}
                    a note about{' '}
                    <Link to={`/contacts/${contact.id}/show`}>
                        {contact.first_name} {contact.last_name}
                    </Link>{' '}
                    of{' '}
                    <Typography component="strong" fontWeight={700}>
                        {company.name}
                    </Typography>
                </Box>
                <Box>
                    {slicedNote && !seeMore
                        ? `${slicedNote}...`
                        : contactNote.text}
                </Box>
                <Box>
                    {slicedNote ? (
                        seeMore ? (
                            <Button
                                size="small"
                                onClick={() => setSeeMore(false)}
                            >
                                See less
                            </Button>
                        ) : (
                            <Button
                                size="small"
                                onClick={() => setSeeMore(true)}
                            >
                                See more
                            </Button>
                        )
                    ) : null}
                </Box>
            </Stack>
            <DisplayDate date={activity.date} />
        </ListItem>
    );
}
