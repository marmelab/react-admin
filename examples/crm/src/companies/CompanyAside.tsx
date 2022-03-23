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
import { Box, Typography, Divider, Link } from '@mui/material';

import { Company, Sale } from '../types';

interface CompanyAsideProps {
    link?: string;
}

export const CompanyAside = ({ link = 'edit' }: CompanyAsideProps) => {
    const record = useRecordContext<Company>();
    if (!record) return null;
    return (
        <Box ml={4} width={250} minWidth={250}>
            <Box textAlign="center" mb={2}>
                {link === 'edit' ? (
                    <EditButton label="Edit Company" />
                ) : (
                    <ShowButton label="Show Company" />
                )}
            </Box>

            <Typography variant="subtitle2">Company info</Typography>
            <Divider />

            <Box mt={2}>
                <Typography variant="body2">
                    Website: <Link href={record.website}>{record.website}</Link>
                    <br />
                    LinkedIn: <Link href={record.linkedIn}>LinkedIn</Link>
                </Typography>
            </Box>

            <Box mt={1}>
                <TextField source="phone_number" />{' '}
                <Typography
                    variant="body2"
                    color="textSecondary"
                    component="span"
                >
                    Main
                </Typography>
            </Box>

            <Box mt={1} mb={3}>
                <TextField source="address" />
                <br />
                <TextField source="city" /> <TextField source="zipcode" />{' '}
                <TextField source="stateAbbr" />
            </Box>

            <Typography variant="subtitle2">Background</Typography>
            <Divider />

            <Box mt={1}>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    component="span"
                >
                    Added on
                </Typography>{' '}
                <DateField
                    source="created_at"
                    options={{ year: 'numeric', month: 'long', day: 'numeric' }}
                    color="textSecondary"
                />
                <br />
                <Typography
                    component="span"
                    variant="body2"
                    color="textSecondary"
                >
                    Followed by
                </Typography>{' '}
                <ReferenceField source="sales_id" reference="sales">
                    <FunctionField<Sale>
                        source="last_name"
                        render={(record?: Sale) =>
                            record
                                ? `${record.first_name} ${record.last_name}`
                                : ''
                        }
                    />
                </ReferenceField>
            </Box>
        </Box>
    );
};
