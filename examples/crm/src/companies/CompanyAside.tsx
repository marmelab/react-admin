import * as React from 'react';
import {
    TextField,
    DateField,
    FunctionField,
    ReferenceField,
    EditButton,
    ShowButton,
    useRecordContext,
} from 'react-admin';
import { Typography, Divider, Link, Stack } from '@mui/material';

import { Company } from '../types';

interface CompanyAsideProps {
    link?: string;
}

export const CompanyAside = ({ link = 'edit' }: CompanyAsideProps) => {
    const record = useRecordContext<Company>();
    if (!record) return null;

    return (
        <Stack ml={4} width={250} minWidth={250} spacing={2}>
            <Stack direction="row" spacing={1}>
                {link === 'edit' ? (
                    <EditButton label="Edit Company" />
                ) : (
                    <ShowButton label="Show Company" />
                )}
            </Stack>

            <CompanyInfo record={record} />

            <AddressInfo record={record} />

            <FinancialInfo record={record} />

            <BackgroundInfo record={record} />

            <ContextInfo record={record} />
        </Stack>
    );
};

const CompanyInfo = ({ record }: { record: Company }) => {
    if (!record.website && !record.linkedIn && !record.phone_number) {
        return null;
    }

    return (
        <Stack>
            <Typography variant="subtitle2">Company Info</Typography>
            <Divider sx={{ mb: 1 }} />
            {record.website && (
                <Typography variant="body2" color="textSecondary">
                    Website: <Link href={record.website}>{record.website}</Link>
                </Typography>
            )}
            {record.linkedIn && (
                <Typography variant="body2" color="textSecondary">
                    LinkedIn: <Link href={record.linkedIn}>LinkedIn</Link>
                </Typography>
            )}
            <TextField source="phone_number" color="textSecondary" />
        </Stack>
    );
};

const FinancialInfo = ({ record }: { record: Company }) => {
    if (!record.revenue && !record.identifier && !record.country) {
        return null;
    }

    return (
        <Stack>
            <Typography variant="subtitle2">Financial Info</Typography>
            <Divider sx={{ mb: 1 }} />
            {record.revenue && (
                <Typography
                    component="span"
                    variant="body2"
                    color="textSecondary"
                >
                    Revenue: <TextField source="revenue" color="textPrimary" />
                </Typography>
            )}
            {record.taxe_identifier && (
                <Typography
                    component="span"
                    variant="body2"
                    color="textSecondary"
                >
                    Tax Identifier:{' '}
                    <TextField source="taxe_identifier" color="textPrimary" />
                </Typography>
            )}
            {record.country && (
                <Typography
                    component="span"
                    variant="body2"
                    color="textSecondary"
                >
                    Country: <TextField source="country" color="textPrimary" />
                </Typography>
            )}
        </Stack>
    );
};

const AddressInfo = ({ record }: { record: Company }) => {
    if (
        !record.address &&
        !record.city &&
        !record.zipcode &&
        !record.stateAbbr
    ) {
        return null;
    }

    return (
        <Stack>
            <Typography variant="subtitle2">Main Address</Typography>
            <Divider sx={{ mb: 1 }} />
            <TextField source="address" color="textSecondary" />
            <TextField source="city" color="textSecondary" />
            <TextField source="zipcode" color="textSecondary" />
            <TextField source="stateAbbr" color="textSecondary" />
        </Stack>
    );
};

const ContextInfo = ({ record }: { record: Company }) => {
    if (!record.context_links || record.context_links.length === 0) return null;

    return (
        <Stack>
            <Typography variant="subtitle2">Context</Typography>
            <Divider sx={{ mb: 1 }} />
            {record.context_links.map((link, index) => (
                <Typography
                    key={index}
                    variant="body2"
                    component={Link}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {link}
                </Typography>
            ))}
        </Stack>
    );
};

const BackgroundInfo = ({ record }: { record: Company }) => {
    if (!record.created_at && !record.sales_id) {
        return null;
    }

    return (
        <Stack>
            <Typography variant="subtitle2">Background</Typography>
            <Divider sx={{ mb: 1 }} />
            {record.created_at ? (
                <Typography variant="body2" color="textSecondary">
                    Added on{' '}
                    <DateField
                        source="created_at"
                        record={record}
                        color="textPrimary"
                        options={{
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        }}
                    />
                </Typography>
            ) : null}

            {record.sales_id ? (
                <Typography
                    component="span"
                    variant="body2"
                    color="textSecondary"
                >
                    Followed by{' '}
                    <ReferenceField
                        source="sales_id"
                        reference="sales"
                        record={record}
                    >
                        <FunctionField
                            source="last_name"
                            color="textPrimary"
                            render={record =>
                                `${record.first_name} ${record.last_name}`
                            }
                        />
                    </ReferenceField>
                </Typography>
            ) : null}
        </Stack>
    );
};
export default CompanyInfo;
