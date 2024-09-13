import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';
import { Divider, Link, Stack, Tooltip, Typography } from '@mui/material';
import {
    DateField,
    EditButton,
    ReferenceField,
    SelectField,
    ShowButton,
    TextField,
    UrlField,
    useRecordContext,
} from 'react-admin';

import { Company } from '../types';
import { sizes } from './sizes';

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

            <ContextInfo record={record} />

            <AdditionalInfo record={record} />
        </Stack>
    );
};

const CompanyInfo = ({ record }: { record: Company }) => {
    if (!record.website && !record.linkedin_url && !record.phone_number) {
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
                    <UrlField
                        source="website"
                        target="_blank"
                        rel="noopener"
                        content={record.website
                            .replace('http://', '')
                            .replace('https://', '')}
                    />
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
                    <Tooltip title={record.linkedin_url}>
                        <Typography
                            variant="body2"
                            component={Link}
                            href={record.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            LinkedIn
                        </Typography>
                    </Tooltip>
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

const ContextInfo = ({ record }: { record: Company }) => {
    if (!record.revenue && !record.id) {
        return null;
    }

    return (
        <Stack>
            <Typography variant="subtitle2">Context</Typography>
            <Divider sx={{ mb: 1 }} />
            {record.sector && (
                <Typography
                    component="span"
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                >
                    Sector: <TextField source="sector" color="textPrimary" />
                </Typography>
            )}
            {record.size && (
                <Typography
                    component="span"
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                >
                    Size:{' '}
                    <SelectField
                        source="size"
                        color="textPrimary"
                        choices={sizes}
                    />
                </Typography>
            )}
            {record.revenue && (
                <Typography
                    component="span"
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                >
                    Revenue: <TextField source="revenue" color="textPrimary" />
                </Typography>
            )}
            {record.tax_identifier && (
                <Typography
                    component="span"
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
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

const AdditionalInfo = ({ record }: { record: Company }) => {
    if (
        !record.created_at &&
        !record.sales_id &&
        !record.description &&
        !record.context_links
    ) {
        return null;
    }
    const getBaseURL = (url: string) => {
        const urlObject = new URL(url);
        return urlObject.origin;
    };

    return (
        <Stack>
            <Typography variant="subtitle2">Additional Info</Typography>
            <Divider sx={{ mb: 1 }} />
            {record.description && (
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    {record.description}
                </Typography>
            )}
            {record.context_links && (
                <Stack>
                    {record.context_links.map((link, index) =>
                        link ? (
                            <Tooltip title={link}>
                                <Typography
                                    key={index}
                                    variant="body2"
                                    gutterBottom
                                    component={Link}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {getBaseURL(link)}
                                </Typography>
                            </Tooltip>
                        ) : null
                    )}
                </Stack>
            )}
            {record.sales_id !== null && (
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Followed by{' '}
                    <ReferenceField
                        source="sales_id"
                        reference="sales"
                        record={record}
                    />
                </Typography>
            )}
            {record.created_at && (
                <Typography variant="body2" color="textSecondary" gutterBottom>
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
            )}
        </Stack>
    );
};
export default CompanyInfo;
