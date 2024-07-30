import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Stack,
    Tab,
    Tabs,
    Typography,
} from '@mui/material';
import { formatDistance } from 'date-fns';
import * as React from 'react';
import { ChangeEvent, useState } from 'react';
import {
    RecordContextProvider,
    ReferenceManyField,
    SelectField,
    ShowBase,
    SortButton,
    TextField,
    useListContext,
    useRecordContext,
    useShowContext,
} from 'react-admin';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import { ActivityLog } from '../activity/ActivityLog';
import { Avatar } from '../contacts/Avatar';
import { TagsList } from '../contacts/TagsList';
import { findDealLabel } from '../deals/deal';
import { Status } from '../misc/Status';
import { useConfigurationContext } from '../root/ConfigurationContext';
import { Company, Contact, Deal } from '../types';
import { CompanyAside } from './CompanyAside';
import { CompanyAvatar } from './CompanyAvatar';
import { sizes } from './sizes';

export const CompanyShow = () => (
    <ShowBase>
        <CompanyShowContent />
    </ShowBase>
);

const CompanyShowContent = () => {
    const { record, isPending } = useShowContext<Company>();
    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (_: ChangeEvent<{}>, newValue: number) => {
        setTabValue(newValue);
    };
    if (isPending || !record) return null;

    let tabIndex = 0;

    return (
        <Box mt={2} display="flex">
            <Box flex="1">
                <Card>
                    <CardContent>
                        <Box display="flex" mb={1}>
                            <CompanyAvatar />
                            <Box ml={2} flex="1">
                                <Typography variant="h5">
                                    {record.name}
                                </Typography>
                                <Typography variant="body2">
                                    <TextField source="sector" />
                                    {record.size && ', '}
                                    <SelectField
                                        source="size"
                                        choices={sizes}
                                    />
                                </Typography>
                            </Box>
                        </Box>
                        <Tabs
                            value={tabValue}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={handleTabChange}
                        >
                            <Tab
                                label={
                                    !record.nb_contacts
                                        ? 'No Contacts'
                                        : record.nb_contacts === 1
                                          ? '1 Contact'
                                          : `${record.nb_contacts} Contacts`
                                }
                            />
                            {record.nb_deals && (
                                <Tab
                                    label={
                                        record.nb_deals === 1
                                            ? '1 deal'
                                            : `${record.nb_deals} Deals`
                                    }
                                />
                            )}
                            {record.description && <Tab label="Description" />}
                            <Tab label="Activity Log" />
                        </Tabs>
                        <Divider />

                        <TabPanel value={tabValue} index={tabIndex++}>
                            <ReferenceManyField
                                reference="contacts"
                                target="company_id"
                                sort={{ field: 'last_name', order: 'ASC' }}
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="flex-end"
                                    spacing={2}
                                    mt={1}
                                >
                                    {!!record.nb_contacts && (
                                        <SortButton
                                            fields={[
                                                'last_name',
                                                'first_name',
                                                'last_seen',
                                            ]}
                                        />
                                    )}
                                    <CreateRelatedContactButton />
                                </Stack>
                                <ContactsIterator />
                            </ReferenceManyField>
                        </TabPanel>
                        {record.nb_deals ? (
                            <TabPanel value={tabValue} index={tabIndex++}>
                                <ReferenceManyField
                                    reference="deals"
                                    target="company_id"
                                    sort={{ field: 'name', order: 'ASC' }}
                                >
                                    <DealsIterator />
                                </ReferenceManyField>
                            </TabPanel>
                        ) : null}
                        {record.description ? (
                            <TabPanel value={tabValue} index={tabIndex++}>
                                <Stack
                                    pt={2}
                                    px={2}
                                    sx={{ whiteSpace: 'pre-line' }}
                                >
                                    <TextField source="description" />
                                </Stack>
                            </TabPanel>
                        ) : null}
                        <TabPanel value={tabValue} index={tabIndex++}>
                            <ActivityLog companyId={record.id} />
                        </TabPanel>
                    </CardContent>
                </Card>
            </Box>
            <CompanyAside />
        </Box>
    );
};

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`wrapped-tabpanel-${index}`}
            aria-labelledby={`wrapped-tab-${index}`}
            {...other}
        >
            {children}
        </div>
    );
};

const ContactsIterator = () => {
    const location = useLocation();
    const { data: contacts, error, isPending } = useListContext<Contact>();

    if (isPending || error) return null;

    const now = Date.now();
    return (
        <List dense sx={{ pt: 0 }}>
            {contacts.map(contact => (
                <RecordContextProvider key={contact.id} value={contact}>
                    <ListItem
                        button
                        component={RouterLink}
                        to={`/contacts/${contact.id}/show`}
                        state={{ from: location.pathname }}
                    >
                        <ListItemAvatar>
                            <Avatar />
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${contact.first_name} ${contact.last_name}`}
                            secondary={
                                <>
                                    {contact.title}
                                    {contact.nb_tasks
                                        ? ` - ${contact.nb_tasks} task${
                                              contact.nb_tasks > 1 ? 's' : ''
                                          }`
                                        : ''}
                                    &nbsp; &nbsp;
                                    <TagsList />
                                </>
                            }
                        />
                        <ListItemSecondaryAction>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                component="span"
                            >
                                last activity{' '}
                                {formatDistance(contact.last_seen, now)} ago{' '}
                                <Status status={contact.status} />
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItem>
                </RecordContextProvider>
            ))}
        </List>
    );
};

const CreateRelatedContactButton = () => {
    const company = useRecordContext<Company>();
    return (
        <Button
            component={RouterLink}
            to="/contacts/create"
            state={company ? { record: { company_id: company.id } } : undefined}
            color="primary"
            size="small"
            startIcon={<PersonAddIcon />}
        >
            Add contact
        </Button>
    );
};

const DealsIterator = () => {
    const { data: deals, error, isPending } = useListContext<Deal>();
    const { dealStages } = useConfigurationContext();
    if (isPending || error) return null;

    const now = Date.now();
    return (
        <Box>
            <List dense>
                {deals.map(deal => (
                    <ListItem
                        button
                        key={deal.id}
                        component={RouterLink}
                        to={`/deals/${deal.id}/show`}
                    >
                        <ListItemText
                            primary={deal.name}
                            secondary={
                                <>
                                    {findDealLabel(dealStages, deal.stage)},{' '}
                                    {deal.amount.toLocaleString('en-US', {
                                        notation: 'compact',
                                        style: 'currency',
                                        currency: 'USD',
                                        currencyDisplay: 'narrowSymbol',
                                        minimumSignificantDigits: 3,
                                    })}
                                    , {deal.type}
                                </>
                            }
                        />
                        <ListItemSecondaryAction>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                component="span"
                            >
                                last activity{' '}
                                {formatDistance(deal.updated_at, now)} ago{' '}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};
