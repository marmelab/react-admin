import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';
import { Divider, Link, Stack, Typography } from '@mui/material';
import {
    DateField,
    EditButton,
    FunctionField,
    ReferenceField,
    ShowButton,
    TextField,
    UrlField,
    useRecordContext,
} from 'react-admin';

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
                <Stack
                    direction="row"
                    alignItems="center"
                    gap={1}
                    minHeight={24}
                >
                    <PublicIcon color="disabled" fontSize="small" />
                    <UrlField source="website" target="_blank" rel="noopener" />
                </Stack>
            )}
            {record.linkedin_url && (
                <Stack
                    direction="row"
                    alignItems="center"
                    gap={1}
                    minHeight={24}
                >
                    <LinkedInIcon color="disabled" fontSize="small" />
                    <UrlField
                        source="linkedin_url"
                        content="LinkedIn"
                        target="_blank"
                        rel="noopener"
                        label="LinkedIn"
                    />
                </Stack>
            )}
            {record.phone_number && (
                <Stack
                    direction="row"
                    alignItems="center"
                    gap={1}
                    minHeight={24}
                >
                    <PhoneIcon color="disabled" fontSize="small" />
                    <TextField source="phone_number" color="textSecondary" />
                </Stack>
            )}
        </Stack>
    );
};

const FinancialInfo = ({ record }: { record: Company }) => {
    if (!record.revenue && !record.identifier) {
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
            {record.tax_identifier && (
                <Typography
                    component="span"
                    variant="body2"
                    color="textSecondary"
                >
                    Tax Identifier:{' '}
                    <TextField source="tax_identifier" color="textPrimary" />
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
            <TextField source="country" color="textSecondary" />
        </Stack>
    );
};

const ContextInfo = ({ record }: { record: Company }) => {
    if (!record.context_links || record.context_links.length === 0) return null;
    const getBaseURL = (url: string) => {
        const urlObject = new URL(url);
        return urlObject.origin;
    };
    return (
        <Stack>
            <Typography variant="subtitle2">Context</Typography>
            <Divider sx={{ mb: 1 }} />
            <Stack gap={1}>
                {record.context_links.map((link, index) =>
                    link ? (
                        <Typography
                            key={index}
                            variant="body2"
                            component={Link}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {getBaseURL(link)}
                        </Typography>
                    ) : null
                )}
            </Stack>
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
