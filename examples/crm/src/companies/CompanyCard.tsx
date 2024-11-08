import * as React from 'react';
import { useState } from 'react';
import { AvatarGroup, Paper, Typography, Box } from '@mui/material';
import DealIcon from '@mui/icons-material/MonetizationOn';
import {
    useCreatePath,
    SelectField,
    useRecordContext,
    Link,
    ReferenceManyField,
    useListContext,
} from 'react-admin';

import { CompanyAvatar } from './CompanyAvatar';
import { Company } from '../types';
import { useConfigurationContext } from '../root/ConfigurationContext';
import { Avatar } from '../contacts/Avatar';

export const CompanyCard = (props: { record?: Company }) => {
    const { companySectors } = useConfigurationContext();
    const [elevation, setElevation] = useState(1);
    const createPath = useCreatePath();
    const record = useRecordContext<Company>(props);
    if (!record) return null;

    return (
        <Link
            to={createPath({
                resource: 'companies',
                id: record.id,
                type: 'show',
            })}
            underline="none"
            onMouseEnter={() => setElevation(3)}
            onMouseLeave={() => setElevation(1)}
        >
            <Paper
                sx={{
                    height: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1em',
                }}
                elevation={elevation}
            >
                <Box display="flex" flexDirection="column" alignItems="center">
                    <CompanyAvatar />
                    <Box textAlign="center" marginTop={1}>
                        <Typography variant="subtitle2">
                            {record.name}
                        </Typography>
                        <SelectField
                            color="textSecondary"
                            source="sector"
                            choices={companySectors.map(sector => ({
                                id: sector,
                                name: sector,
                            }))}
                        />
                    </Box>
                </Box>
                <Box display="flex" width="100%">
                    <Box display="flex" alignItems="center">
                        {record.nb_contacts ? (
                            <ReferenceManyField
                                reference="contacts"
                                target="company_id"
                            >
                                <AvatarGroupIterator />
                            </ReferenceManyField>
                        ) : null}
                    </Box>
                    {record.nb_deals ? (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                ml: 2,
                                gap: 0.5,
                            }}
                        >
                            <DealIcon color="disabled" />
                            <Typography variant="subtitle2">
                                {record.nb_deals}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                {record.nb_deals
                                    ? record.nb_deals > 1
                                        ? 'deals'
                                        : 'deal'
                                    : 'deal'}
                            </Typography>
                        </Box>
                    ) : null}
                </Box>
            </Paper>
        </Link>
    );
};

const AvatarGroupIterator = () => {
    const { data, total, error, isPending } = useListContext();
    if (isPending || error) return null;
    return (
        <AvatarGroup
            max={4}
            total={total}
            spacing="medium"
            sx={{
                '& .MuiAvatar-circular': {
                    width: 20,
                    height: 20,
                    fontSize: '0.6rem',
                },
            }}
        >
            {data.map((record: any) => (
                <Avatar
                    key={record.id}
                    record={record}
                    width={20}
                    height={20}
                    title={`${record.first_name} ${record.last_name}`}
                />
            ))}
        </AvatarGroup>
    );
};
