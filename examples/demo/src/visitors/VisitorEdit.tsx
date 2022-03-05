import * as React from 'react';
import {
    DateInput,
    Edit,
    NullableBooleanInput,
    TextInput,
    PasswordInput,
    SimpleForm,
    useTranslate,
} from 'react-admin';
import { Box, Typography } from '@mui/material';

import Aside from './Aside';
import FullNameField from './FullNameField';
import SegmentsInput from './SegmentsInput';
import { validateForm } from './VisitorCreate';

const VisitorEdit = () => {
    const translate = useTranslate();
    return (
        <Edit title={<VisitorTitle />} aside={<Aside />}>
            <SimpleForm validate={validateForm}>
                <Box display={{ md: 'block', lg: 'flex' }}>
                    <Box flex={2} mr={{ md: 0, lg: '1em' }}>
                        <Typography variant="h6" gutterBottom>
                            {translate(
                                'resources.customers.fieldGroups.identity'
                            )}
                        </Typography>
                        <Box display={{ xs: 'block', sm: 'flex' }}>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                                <TextInput
                                    source="first_name"
                                    isRequired
                                    fullWidth
                                />
                            </Box>
                            <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
                                <TextInput
                                    source="last_name"
                                    isRequired
                                    fullWidth
                                />
                            </Box>
                        </Box>
                        <TextInput
                            type="email"
                            source="email"
                            isRequired
                            fullWidth
                        />
                        <Box display={{ xs: 'block', sm: 'flex' }}>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                                <DateInput
                                    source="birthday"
                                    fullWidth
                                    helperText={false}
                                />
                            </Box>
                            <Box flex={2} ml={{ xs: 0, sm: '0.5em' }} />
                        </Box>

                        <Box mt="1em" />

                        <Typography variant="h6" gutterBottom>
                            {translate(
                                'resources.customers.fieldGroups.address'
                            )}
                        </Typography>
                        <TextInput
                            source="address"
                            multiline
                            fullWidth
                            helperText={false}
                        />
                        <Box display={{ xs: 'block', sm: 'flex' }}>
                            <Box flex={2} mr={{ xs: 0, sm: '0.5em' }}>
                                <TextInput
                                    source="city"
                                    fullWidth
                                    helperText={false}
                                />
                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                                <TextInput
                                    source="stateAbbr"
                                    fullWidth
                                    helperText={false}
                                />
                            </Box>
                            <Box flex={2}>
                                <TextInput
                                    source="zipcode"
                                    fullWidth
                                    helperText={false}
                                />
                            </Box>
                        </Box>

                        <Box mt="1em" />

                        <Typography variant="h6" gutterBottom>
                            {translate(
                                'resources.customers.fieldGroups.change_password'
                            )}
                        </Typography>
                        <Box display={{ xs: 'block', sm: 'flex' }}>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                                <PasswordInput source="password" fullWidth />
                            </Box>
                            <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
                                <PasswordInput
                                    source="confirm_password"
                                    fullWidth
                                />
                            </Box>
                        </Box>
                    </Box>
                    <Box
                        flex={1}
                        ml={{ xs: 0, lg: '1em' }}
                        mt={{ xs: '1em', lg: 0 }}
                    >
                        <Typography variant="h6" gutterBottom>
                            {translate('resources.customers.fieldGroups.stats')}
                        </Typography>

                        <SegmentsInput fullWidth />
                        <NullableBooleanInput
                            fullWidth
                            source="has_newsletter"
                        />
                    </Box>
                </Box>
            </SimpleForm>
        </Edit>
    );
};

const VisitorTitle = () => <FullNameField size="32" />;

export default VisitorEdit;
