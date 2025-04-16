import * as React from 'react';
import {
    NumberInput,
    ReferenceInput,
    required,
    SelectInput,
    TextInput,
} from 'react-admin';
import { InputAdornment, Grid } from '@mui/material';

export const ProductEditDetails = () => (
    <Grid container columnSpacing={2}>
        <Grid size={{ xs: 12, sm: 8 }}>
            <TextInput source="reference" validate={req} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
            <ReferenceInput source="category_id" reference="categories">
                <SelectInput optionText="name" validate={req} />
            </ReferenceInput>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
            <NumberInput
                source="width"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">cm</InputAdornment>
                    ),
                }}
                validate={req}
            />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
            <NumberInput
                source="height"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">cm</InputAdornment>
                    ),
                }}
                validate={req}
            />
        </Grid>
        <Grid size={{ xs: 0, sm: 48 }} />
        <Grid size={{ xs: 12, sm: 4 }}>
            <NumberInput
                source="price"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">€</InputAdornment>
                    ),
                }}
                validate={req}
            />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
            <NumberInput source="stock" validate={req} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
            <NumberInput source="sales" validate={req} />
        </Grid>
    </Grid>
);

const req = [required()];
