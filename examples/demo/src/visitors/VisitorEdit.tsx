import * as React from 'react';
import {
    DateInput,
    Edit,
    NullableBooleanInput,
    TextInput,
    PasswordInput,
    SimpleForm,
    useTranslate,
    useDefaultTitle,
    useEditContext,
} from 'react-admin';
import { Grid, Box, Typography } from '@mui/material';

import Aside from './Aside';
import FullNameField from './FullNameField';
import SegmentsInput from './SegmentsInput';
import { validateForm } from './VisitorCreate';

const VisitorEdit = () => {
    const translate = useTranslate();
    return (
        <Edit title={<VisitorTitle />} aside={<Aside />}>
            <SimpleForm validate={validateForm}>
                <div>
                    <Grid container width={{ xs: '100%', xl: 800 }} spacing={2}>
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Typography variant="h6" gutterBottom>
                                {translate(
                                    'resources.customers.fieldGroups.identity'
                                )}
                            </Typography>
                            <Box display={{ xs: 'block', sm: 'flex' }}>
                                <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                                    <TextInput source="first_name" isRequired />
                                </Box>
                                <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
                                    <TextInput source="last_name" isRequired />
                                </Box>
                            </Box>
                            <TextInput type="email" source="email" isRequired />
                            <Box display={{ xs: 'block', sm: 'flex' }}>
                                <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                                    <DateInput
                                        source="birthday"
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
                                helperText={false}
                            />
                            <Box display={{ xs: 'block', sm: 'flex' }}>
                                <Box flex={2} mr={{ xs: 0, sm: '0.5em' }}>
                                    <TextInput
                                        source="city"
                                        helperText={false}
                                    />
                                </Box>
                                <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                                    <TextInput
                                        source="stateAbbr"
                                        helperText={false}
                                    />
                                </Box>
                                <Box flex={2}>
                                    <TextInput
                                        source="zipcode"
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
                                    <PasswordInput source="password" />
                                </Box>
                                <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
                                    <PasswordInput source="confirm_password" />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                {translate(
                                    'resources.customers.fieldGroups.stats'
                                )}
                            </Typography>

                            <SegmentsInput />
                            <NullableBooleanInput source="has_newsletter" />
                        </Grid>
                    </Grid>
                </div>
            </SimpleForm>
        </Edit>
    );
};

const VisitorTitle = () => {
    const appTitle = useDefaultTitle();
    const { defaultTitle } = useEditContext();
    return (
        <>
            <title>{`${appTitle} - ${defaultTitle}`}</title>
            <FullNameField
                source="last_name"
                size="32"
                sx={{ margin: '5px 0' }}
            />
        </>
    );
};

export default VisitorEdit;
