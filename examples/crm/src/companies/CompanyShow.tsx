import * as React from 'react';
import { useState, ChangeEvent } from 'react';
import {
    ShowBase,
    TextField,
    ReferenceManyField,
    SelectField,
    useShowContext,
    useRecordContext,
    useListContext,
    RecordContextProvider,
    SortButton,
} from 'react-admin';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Tabs,
    Tab,
    Divider,
    Stack,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Link as RouterLink } from 'react-router-dom';
import { formatDistance } from 'date-fns';

import { Avatar } from '../contacts/Avatar';
import { Status } from '../misc/Status';
import { TagsList } from '../contacts/TagsList';
import { sizes } from './sizes';
import { LogoField } from './LogoField';
import { CompanyAside } from './CompanyAside';
import { Company, Deal, Contact } from '../types';
import { stageNames } from '../deals/stages';

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
                            <LogoField />
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
                            {record.nb_contacts && (
                                <Tab
                                    label={
                                        record.nb_contacts === 1
                                            ? '1 Contact'
                                            : `${record.nb_contacts} Contacts`
                                    }
                                />
                            )}
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
                        </Tabs>
                        <Divider />
                        {record.nb_contacts ? (
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
                                        <SortButton
                                            fields={[
                                                'last_name',
                                                'first_name',
                                                'last_seen',
                                            ]}
                                        />
                                        <CreateRelatedContactButton />
                                    </Stack>
                                    <ContactsIterator />
                                </ReferenceManyField>
                            </TabPanel>
                        ) : null}
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
                                <Stack mt={2}>
                                    <TextField source="description" />
                                </Stack>
                            </TabPanel>
                        ) : null}
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
                                    {/* @ts-ignore */}
                                    {stageNames[deal.stage]},{' '}
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
