import * as React from 'react';

import {
    Create,
    ReferenceInput,
    Form,
    TextInput,
    SelectInput,
    Toolbar,
    required,
} from 'react-admin';
import { Box, CardContent, Divider, Avatar, Stack, Grid } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';

import { sectors } from './sectors';
import { sizes } from './sizes';

export const CompanyCreate = () => (
    <Create actions={false} redirect="show">
        <Form>
            <CardContent>
                <Stack direction="row">
                    <Avatar sx={{ mt: 1 }}>
                        <BusinessIcon />
                    </Avatar>
                    <Box ml={2} flex="1" maxWidth={796}>
                        <TextInput
                            source="name"
                            validate={required()}
                            fullWidth
                        />
                        <Stack direction="row">
                            <SelectInput
                                source="sector"
                                choices={sectors}
                                sx={{ width: 200 }}
                            />
                            <SelectInput
                                source="size"
                                choices={sizes}
                                sx={{ ml: 2, width: 200 }}
                            />
                        </Stack>
                        <Divider sx={{ mb: 2, width: '100%' }} />

                        <TextInput
                            source="address"
                            fullWidth
                            helperText={false}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextInput fullWidth source="city" />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextInput fullWidth source="zipcode" />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextInput fullWidth source="stateAbbr" />
                            </Grid>
                        </Grid>
                        <Divider sx={{ mb: 2, width: '100%' }} />

                        <TextInput
                            source="website"
                            fullWidth
                            helperText={false}
                        />
                        <TextInput
                            source="linkedIn"
                            fullWidth
                            helperText={false}
                        />
                        <TextInput source="logo" fullWidth />
                        <Divider sx={{ mb: 2, width: '100%' }} />

                        <Stack direction="row">
                            <TextInput
                                source="phone_number"
                                helperText={false}
                                sx={{ width: 200 }}
                            />
                            <ReferenceInput source="sales_id" reference="sales">
                                <SelectInput
                                    label="Account manager"
                                    helperText={false}
                                    optionText={(sales: any) =>
                                        `${sales.first_name} ${sales.last_name}`
                                    }
                                    sx={{ width: 200, ml: 2 }}
                                />
                            </ReferenceInput>
                        </Stack>
                    </Box>
                </Stack>
            </CardContent>
            <Toolbar />
        </Form>
    </Create>
);
