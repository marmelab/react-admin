import * as React from 'react';
import {
    TextInput,
    ReferenceInput,
    AutocompleteInput,
    BooleanInput,
    required,
    useCreate,
    useGetIdentity,
    useNotify,
} from 'react-admin';
import { Divider, Box } from '@mui/material';

import { Company } from '../types';

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
            <Box display="flex" width={430}>
                <TextInput source="first_name" validate={required()} />
                <Spacer />
                <TextInput source="last_name" validate={required()} />
            </Box>
            <Box display="flex" width={430}>
                <TextInput source="title" />
                <Spacer />
                <ReferenceInput source="company_id" reference="companies">
                    <AutocompleteInput
                        optionText="name"
                        validate={required()}
                        onCreate={handleCreateCompany}
                    />
                </ReferenceInput>
            </Box>
            <Divider />
            <Box mt={2} width={430}>
                <TextInput source="email" />
            </Box>
            <Box display="flex" width={430}>
                <TextInput source="phone_number1" />
                <Spacer />
                <TextInput source="phone_number2" />
            </Box>
            <Divider />
            <Box mt={2} width={430}>
                <TextInput source="background" multiline />
                <TextInput source="avatar" />
                <BooleanInput source="has_newsletter" />
            </Box>
        </Box>
    );
};

const Spacer = () => <Box width={20} component="span" />;
