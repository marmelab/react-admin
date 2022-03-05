import * as React from 'react';
import {
    Create,
    DateInput,
    SimpleForm,
    TextInput,
    useTranslate,
    PasswordInput,
    required,
    email,
} from 'react-admin';
import { Box, Typography } from '@mui/material';

export const validatePasswords = ({
    password,
    confirm_password,
}: Record<string, string>) => {
    const errors = {} as any;

    if (password && confirm_password && password !== confirm_password) {
        errors.confirm_password = [
            'resources.customers.errors.password_mismatch',
        ];
    }

    return errors;
};

const VisitorCreate = () => (
    <Create>
        <SimpleForm
            sx={{ maxWidth: 500 }}
            // Here for the GQL provider
            defaultValues={{
                birthday: new Date(),
                first_seen: new Date(),
                last_seen: new Date(),
                has_ordered: false,
                latest_purchase: new Date(),
                has_newsletter: false,
                groups: [],
                nb_commands: 0,
                total_spent: 0,
            }}
            validate={validatePasswords}
        >
            <SectionTitle label="resources.customers.fieldGroups.identity" />
            <Box display={{ xs: 'block', sm: 'flex', width: '100%' }}>
                <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                    <TextInput
                        source="first_name"
                        validate={requiredValidate}
                        fullWidth
                    />
                </Box>
                <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
                    <TextInput
                        source="last_name"
                        validate={requiredValidate}
                        fullWidth
                    />
                </Box>
            </Box>
            <TextInput
                type="email"
                source="email"
                fullWidth
                validate={[required(), email()]}
            />
            <DateInput source="birthday" />
            <Separator />
            <SectionTitle label="resources.customers.fieldGroups.address" />
            <TextInput
                source="address"
                multiline
                fullWidth
                helperText={false}
            />
            <Box display={{ xs: 'block', sm: 'flex' }}>
                <Box flex={2} mr={{ xs: 0, sm: '0.5em' }}>
                    <TextInput source="city" fullWidth helperText={false} />
                </Box>
                <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                    <TextInput
                        source="stateAbbr"
                        fullWidth
                        helperText={false}
                    />
                </Box>
                <Box flex={2}>
                    <TextInput source="zipcode" fullWidth helperText={false} />
                </Box>
            </Box>
            <Separator />
            <SectionTitle label="resources.customers.fieldGroups.password" />
            <Box display={{ xs: 'block', sm: 'flex' }}>
                <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                    <PasswordInput source="password" fullWidth />
                </Box>
                <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
                    <PasswordInput source="confirm_password" fullWidth />
                </Box>
            </Box>
        </SimpleForm>
    </Create>
);

const requiredValidate = [required()];

const SectionTitle = ({ label }: { label: string }) => {
    const translate = useTranslate();

    return (
        <Typography variant="h6" gutterBottom>
            {translate(label as string)}
        </Typography>
    );
};

const Separator = () => <Box pt="1em" />;

export default VisitorCreate;
