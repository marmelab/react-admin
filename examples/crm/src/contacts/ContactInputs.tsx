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
import { useConfigurationContext } from '../root/ConfigurationContext';

const isLinkedinUrl = (url: string) => {
    if (!url) return;
    try {
        // Parse the URL to ensure it is valid
        const parsedUrl = new URL(url);
        if (!parsedUrl.hostname.includes('linkedin.com')) {
            return 'URL must be from linkedin.com';
        }
    } catch (e) {
        // If URL parsing fails, return false
        return 'Must be a valid URL';
    }
};

export const ContactInputs = () => {
    const { contactGender } = useConfigurationContext();
    const [create] = useCreate();
    const { identity } = useGetIdentity();
    const notify = useNotify();
    const handleCreateCompany = async (name?: string) => {
        if (!name) return;
        try {
            const newCompany = await create(
                'companies',
                {
                    data: {
                        name,
                        sales_id: identity?.id,
                        created_at: new Date().toISOString(),
                    },
                },
                { returnPromise: true }
            );
            return newCompany;
        } catch (error) {
            notify('An error occurred while creating the company', {
                type: 'error',
            });
            throw error;
        }
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
                <TextInput
                    source="background"
                    label="How you met?"
                    multiline
                    helperText={false}
                />
                <TextInput
                    source="linkedin_url"
                    label="Linkedin URL"
                    helperText={false}
                    validate={isLinkedinUrl}
                />
                <Stack direction="row" gap={1} alignItems="center">
                    <SelectInput
                        source="gender"
                        choices={contactGender}
                        helperText={false}
                        optionText="label"
                        optionValue="value"
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
