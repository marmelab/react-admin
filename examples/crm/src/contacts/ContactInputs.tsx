import * as React from 'react';
import {
    Divider,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    AutocompleteInput,
    BooleanInput,
    RadioButtonGroupInput,
    ReferenceInput,
    SelectInput,
    TextInput,
    email,
    required,
    useCreate,
    useGetIdentity,
    useNotify,
} from 'react-admin';
import { useFormContext } from 'react-hook-form';

import { isLinkedinUrl } from '../misc/isLinkedInUrl';
import { useConfigurationContext } from '../root/ConfigurationContext';
import { Sale } from '../types';
import { Avatar } from './Avatar';

export const ContactInputs = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Stack gap={2} p={1}>
            <Avatar />
            <Stack gap={4} direction={isMobile ? 'column' : 'row'}>
                <Stack gap={4} flex={1}>
                    <ContactIdentityInputs />
                    <ContactPositionInputs />
                </Stack>
                <Divider
                    orientation={isMobile ? 'horizontal' : 'vertical'}
                    flexItem
                />
                <Stack gap={4} flex={1}>
                    <ContactPersonalInformationInputs />
                    <ContactMiscInputs />
                </Stack>
            </Stack>
        </Stack>
    );
};

const ContactIdentityInputs = () => {
    const { contactGender } = useConfigurationContext();
    return (
        <Stack>
            <Typography variant="h6">Identity</Typography>
            <RadioButtonGroupInput
                label={false}
                source="gender"
                choices={contactGender}
                helperText={false}
                optionText="label"
                optionValue="value"
                sx={{ '& .MuiRadio-root': { paddingY: 0 } }}
                defaultValue={contactGender[0].value}
            />
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
    );
};

const ContactPositionInputs = () => {
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
        }
    };
    return (
        <Stack>
            <Typography variant="h6">Position</Typography>
            <TextInput source="title" helperText={false} />
            <ReferenceInput source="company_id" reference="companies">
                <AutocompleteInput
                    optionText="name"
                    onCreate={handleCreateCompany}
                    helperText={false}
                />
            </ReferenceInput>
        </Stack>
    );
};

const ContactPersonalInformationInputs = () => {
    const { getValues, setValue } = useFormContext();

    // set first and last name based on email
    const handleEmailChange = (email: string) => {
        const { first_name, last_name } = getValues();
        if (first_name || last_name || !email) return;
        const [first, last] = email.split('@')[0].split('.');
        setValue('first_name', first.charAt(0).toUpperCase() + first.slice(1));
        setValue('last_name', last.charAt(0).toUpperCase() + last.slice(1));
    };

    const handleEmailPaste: React.ClipboardEventHandler<HTMLDivElement> = e => {
        const email = e.clipboardData?.getData('text/plain');
        handleEmailChange(email);
    };

    const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const email = e.target.value;
        handleEmailChange(email);
    };

    return (
        <Stack>
            <Typography variant="h6">Personal info</Typography>
            <TextInput
                source="email"
                helperText={false}
                validate={email()}
                onPaste={handleEmailPaste}
                onBlur={handleEmailBlur}
            />
            <Stack gap={1} flexDirection="row">
                <TextInput
                    source="phone_1_number"
                    label="Phone number 1"
                    helperText={false}
                />
                <SelectInput
                    source="phone_1_type"
                    label="Type"
                    helperText={false}
                    optionText={choice => choice.id}
                    choices={[{ id: 'Work' }, { id: 'Home' }, { id: 'Other' }]}
                    defaultValue={'Work'}
                />
            </Stack>
            <Stack gap={1} flexDirection="row">
                <TextInput
                    source="phone_2_number"
                    label="Phone number 2"
                    helperText={false}
                />
                <SelectInput
                    source="phone_2_type"
                    label="Type"
                    helperText={false}
                    optionText={choice => choice.id}
                    choices={[{ id: 'Work' }, { id: 'Home' }, { id: 'Other' }]}
                    defaultValue={'Work'}
                />
            </Stack>
            <TextInput
                source="linkedin_url"
                label="Linkedin URL"
                helperText={false}
                validate={isLinkedinUrl}
            />
        </Stack>
    );
};

const ContactMiscInputs = () => {
    return (
        <Stack>
            <Typography variant="h6">Misc</Typography>
            <TextInput
                source="background"
                label="Background info (bio, how you met, etc)"
                multiline
                helperText={false}
            />
            <BooleanInput source="has_newsletter" helperText={false} />
            <ReferenceInput
                reference="sales"
                source="sales_id"
                sort={{ field: 'last_name', order: 'ASC' }}
                filter={{
                    'disabled@neq': true,
                }}
            >
                <SelectInput
                    helperText={false}
                    label="Account manager"
                    optionText={saleOptionRenderer}
                    validate={required()}
                />
            </ReferenceInput>
        </Stack>
    );
};

const saleOptionRenderer = (choice: Sale) =>
    `${choice.first_name} ${choice.last_name}`;
