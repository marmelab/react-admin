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
    const { record, isLoading } = useShowContext<Company>();
    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (event: ChangeEvent<{}>, newValue: number) => {
        setTabValue(newValue);
    };
    if (isLoading || !record) return null;
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
                                    <TextField source="sector" />,{' '}
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
                        </Tabs>
                        <Divider />
                        <TabPanel value={tabValue} index={0}>
                            <ReferenceManyField
                                reference="contacts"
                                target="company_id"
                                sort={{ field: 'last_name', order: 'ASC' }}
                            >
                                <ContactsIterator />
                            </ReferenceManyField>
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
                            <ReferenceManyField
                                reference="deals"
                                target="company_id"
                                sort={{ field: 'name', order: 'ASC' }}
                            >
                                <DealsIterator />
                            </ReferenceManyField>
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
    const { data: contacts, isLoading } = useListContext<Contact>();
    if (isLoading) return null;

    const now = Date.now();
    return (
        <Box>
            <List>
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
                                        {contact.title} <TagsList />
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
                                    {formatDistance(
                                        new Date(contact.last_seen),
                                        now
                                    )}{' '}
                                    ago <Status status={contact.status} />
                                </Typography>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </RecordContextProvider>
                ))}
            </List>
            <Box textAlign="center" mt={1}>
                <CreateRelatedContactButton />
            </Box>
        </Box>
    );
};

const CreateRelatedContactButton = () => {
    const company = useRecordContext<Company>();
    return (
        <Button
            component={RouterLink}
            to="/contacts/create"
            state={{ record: { company_id: company.id } }}
            color="primary"
            variant="contained"
            size="small"
            startIcon={<PersonAddIcon />}
        >
            Add contact
        </Button>
    );
};

const DealsIterator = () => {
    const { data: deals, isLoading } = useListContext<Deal>();
    if (isLoading) return null;

    const now = Date.now();
    return (
        <Box>
            <List>
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
                                {formatDistance(new Date(deal.updated_at), now)}{' '}
                                ago{' '}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};
