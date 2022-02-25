import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    useEditController,
    EditContextProvider,
    useTranslate,
    TextInput,
    SimpleForm,
    DateField,
    EditProps,
    Labeled,
} from 'react-admin';
import { Stack, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import ProductReferenceField from '../products/ProductReferenceField';
import CustomerReferenceField from '../visitors/CustomerReferenceField';
import StarRatingField from './StarRatingField';
import ReviewEditToolbar from './ReviewEditToolbar';
import { Review } from '../types';

const PREFIX = 'ReviewEdit';

const classes = {
    root: `${PREFIX}-root`,
    title: `${PREFIX}-title`,
    form: `${PREFIX}-form`,
    inlineField: `${PREFIX}-inlineField`,
};

const Root = styled('div')(({ theme }) => ({
    [`&.${classes.root}`]: {
        paddingTop: 40,
    },

    [`& .${classes.title}`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '1em',
    },

    [`& .${classes.form}`]: {
        [theme.breakpoints.up('xs')]: {
            width: 400,
        },
        [theme.breakpoints.down('sm')]: {
            width: '100vw',
            marginTop: -30,
        },
    },

    [`& .${classes.inlineField}`]: {
        display: 'inline-block',
        width: '50%',
    },
}));

interface Props extends EditProps<Review> {
    onCancel: () => void;
}

const ReviewEdit = ({ onCancel, ...props }: Props) => {
    const controllerProps = useEditController<Review>(props);
    const translate = useTranslate();
    if (!controllerProps.record) {
        return null;
    }
    return (
        <Root className={classes.root}>
            <div className={classes.title}>
                <Typography variant="h6">
                    {translate('resources.reviews.detail')}
                </Typography>
                <IconButton onClick={onCancel} size="large">
                    <CloseIcon />
                </IconButton>
            </div>
            <EditContextProvider value={controllerProps}>
                <SimpleForm
                    className={classes.form}
                    record={controllerProps.record}
                    onSubmit={controllerProps.save}
                    resource="reviews"
                    toolbar={<ReviewEditToolbar />}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        mb={2}
                        justifyContent="space-between"
                    >
                        <Stack spacing={2}>
                            <Labeled>
                                <CustomerReferenceField
                                    formClassName={classes.inlineField}
                                />
                            </Labeled>
                            <Labeled>
                                <ProductReferenceField
                                    formClassName={classes.inlineField}
                                />
                            </Labeled>
                        </Stack>
                        <Stack spacing={2}>
                            <Labeled>
                                <DateField
                                    source="date"
                                    formClassName={classes.inlineField}
                                />
                            </Labeled>
                            <Labeled>
                                <StarRatingField
                                    formClassName={classes.inlineField}
                                />
                            </Labeled>
                        </Stack>
                    </Stack>
                    <TextInput
                        source="comment"
                        maxRows={15}
                        multiline
                        fullWidth
                    />
                </SimpleForm>
            </EditContextProvider>
        </Root>
    );
};

export default ReviewEdit;
