import * as React from 'react';
import {
    EditBase,
    useTranslate,
    TextInput,
    SimpleForm,
    DateField,
    EditProps,
    Labeled,
} from 'react-admin';
import { Box, Grid, Stack, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import ProductReferenceField from '../products/ProductReferenceField';
import CustomerReferenceField from '../visitors/CustomerReferenceField';
import StarRatingField from './StarRatingField';
import ReviewEditToolbar from './ReviewEditToolbar';
import { Review } from '../types';

interface Props extends EditProps<Review> {
    onCancel: () => void;
}

const ReviewEdit = ({ id, onCancel }: Props) => {
    const translate = useTranslate();
    return (
        <EditBase id={id}>
            <Box pt={5} width={{ xs: '100vW', sm: 400 }} mt={{ xs: 2, sm: 1 }}>
                <Stack direction="row" p={2}>
                    <Typography variant="h6" flex="1">
                        {translate('resources.reviews.detail')}
                    </Typography>
                    <IconButton onClick={onCancel} size="small">
                        <CloseIcon />
                    </IconButton>
                </Stack>
                <SimpleForm
                    sx={{ pt: 0, pb: 0 }}
                    toolbar={<ReviewEditToolbar />}
                >
                    <Grid container rowSpacing={1} mb={1}>
                        <Grid item xs={6}>
                            <Labeled>
                                <CustomerReferenceField />
                            </Labeled>
                        </Grid>
                        <Grid item xs={6}>
                            <Labeled label="resources.reviews.fields.product_id">
                                <ProductReferenceField />
                            </Labeled>
                        </Grid>
                        <Grid item xs={6}>
                            <Labeled>
                                <DateField source="date" />
                            </Labeled>
                        </Grid>
                        <Grid item xs={6}>
                            <Labeled>
                                <StarRatingField />
                            </Labeled>
                        </Grid>
                    </Grid>
                    <TextInput
                        source="comment"
                        maxRows={15}
                        multiline
                        fullWidth
                    />
                </SimpleForm>
            </Box>
        </EditBase>
    );
};

export default ReviewEdit;
