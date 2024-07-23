import * as React from 'react';

import {
    ReferenceInput,
    TextInput,
    SelectInput,
    required,
    ArrayInput,
    SimpleFormIterator,
    ImageInput,
    ImageField,
} from 'react-admin';
import { Divider, Stack, Grid } from '@mui/material';

import { sizes } from './sizes';
import { useConfigurationContext } from '../root/ConfigurationContext';

export const CompanyForm = () => {
    const { companySectors } = useConfigurationContext();
    return (
        <>
            <TextInput source="name" validate={required()} />
            <Stack direction="row">
                <SelectInput
                    source="sector"
                    choices={companySectors.map(sector => ({
                        id: sector,
                        name: sector,
                    }))}
                    sx={{ width: 200 }}
                />
                <SelectInput
                    source="size"
                    choices={sizes}
                    sx={{ ml: 2, width: 200 }}
                />
            </Stack>
            <Divider sx={{ mb: 2, width: '100%' }} />

            <TextInput source="address" helperText={false} />
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <TextInput source="city" helperText={false} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextInput source="zipcode" helperText={false} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextInput source="stateAbbr" helperText={false} />
                </Grid>
            </Grid>
            <TextInput source="country" />
            <Divider sx={{ mb: 2, width: '100%' }} />

            <TextInput source="website" helperText={false} />
            <TextInput source="linkedin_url" helperText={false} />
            <ImageInput source="logo" accept={{ 'image/*': ['.png', '.jpg'] }}>
                <ImageField source="src" title="title" />
            </ImageInput>
            <Divider sx={{ mb: 2, width: '100%' }} />

            <Stack direction="row">
                <TextInput source="phone_number" sx={{ width: 200 }} />
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

            <Divider sx={{ mb: 2, width: '100%' }} />
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <TextInput source="revenue" />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextInput source="taxe_identifier" />
                </Grid>
            </Grid>

            <Divider sx={{ mb: 2, width: '100%' }} />
            <TextInput source="description" multiline />
            <ArrayInput source="context_links">
                <SimpleFormIterator disableReordering fullWidth>
                    <TextInput source="" hiddenLabel helperText={false} />
                </SimpleFormIterator>
            </ArrayInput>
        </>
    );
};
