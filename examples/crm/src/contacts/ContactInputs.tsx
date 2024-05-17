import * as React from 'react';
import {
    TextInput,
    ReferenceInput,
    AutocompleteInput,
    BooleanInput,
    SelectInput,
    required,
    email,
    useCreate,
    useGetIdentity,
    useNotify,
} from 'react-admin';
import { Divider, Box, Stack } from '@mui/material';

import { Company } from '../types';
import { genders } from './constants';

export const ContactInputs = () => {
    const [create] = useCreate();
    const { identity } = useGetIdentity();
    const notify = useNotify();
    const handleCreateCompany = async (companyName?: string) => {
        if (!companyName) return;
        const newCompany = await new Promise<Company>((resolve, reject) => {
            create(
                'companies',
                {
                    data: {
                        name: companyName,
                        sales_id: identity?.id,
                        created_at: new Date().toISOString(),
                    },
                },
                {
                    onSuccess: resolve,
                    onError: error => {
                        notify('An error occurred while creating the company', {
                            type: 'error',
                        });
                        reject(error);
                    },
                }
            );
        });
        return { id: newCompany.id, name: newCompany.name };
    };
    return (
        <Box flex="1" mt={-1}>
            <Stack direction="row" width={430} gap={1}>
                <TextInput
                    source="first_name"
                    validate={required()}
                    helperText={false}
                />
                <TextInput
                    source="last_name"
                    validate={required()}
                    helperText={false}
                />
            </Stack>
            <Stack direction="row" width={430} gap={1}>
                <TextInput source="title" helperText={false} />
                <ReferenceInput source="company_id" reference="companies">
                    <AutocompleteInput
                        optionText="name"
                        validate={required()}
                        onCreate={handleCreateCompany}
                        helperText={false}
                    />
                </ReferenceInput>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Box width={430}>
                <TextInput
                    source="email"
                    helperText={false}
                    validate={email()}
                />
                <Stack direction="row" gap={1}>
                    <TextInput source="phone_number1" helperText={false} />
                    <TextInput source="phone_number2" helperText={false} />
                </Stack>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box width={430}>
                <TextInput source="background" multiline helperText={false} />
                <TextInput source="avatar" helperText={false} />
                <Stack direction="row" gap={1} alignItems="center">
                    <SelectInput
                        source="gender"
                        choices={genders}
                        helperText={false}
                    />
                    <BooleanInput
                        source="has_newsletter"
                        sx={{
                            width: '100%',
                            label: { justifyContent: 'center' },
                        }}
                        helperText={false}
                    />
                </Stack>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box width={430}>
                <ReferenceInput
                    reference="sales"
                    source="sales_id"
                    sort={{ field: 'last_name', order: 'ASC' }}
                >
                    <SelectInput
                        helperText={false}
                        label="Account manager"
                        sx={{ width: 210 }}
                    />
                </ReferenceInput>
            </Box>
        </Box>
    );
};
