import * as React from 'react';
import {
    SimpleForm,
    Create,
    ReferenceInput,
    TextInput,
    DateInput,
    AutocompleteInput,
    required,
    useNotify,
    useRedirect,
    getRecordFromLocation,
    useDefaultTitle,
    useCreateContext,
} from 'react-admin';
import { useLocation } from 'react-router';

import StarRatingInput from './StarRatingInput';

const ReviewTitle = () => {
    const appTitle = useDefaultTitle();
    const { defaultTitle } = useCreateContext();
    return (
        <>
            <title>{`${appTitle} - ${defaultTitle}`}</title>
            <span>{defaultTitle}</span>
        </>
    );
};

const ReviewCreate = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const location = useLocation();

    const onSuccess = (_: any) => {
        const record = getRecordFromLocation(location);
        notify('resources.reviews.notifications.created');
        if (record && record.product_id) {
            redirect(`/products/${record.product_id}/reviews`);
        } else {
            redirect(`/reviews`);
        }
    };

    return (
        <Create mutationOptions={{ onSuccess }} title={<ReviewTitle />}>
            <SimpleForm
                defaultValues={{ status: 'pending' }}
                sx={{
                    maxWidth: '30em',
                }}
            >
                <ReferenceInput source="customer_id" reference="customers">
                    <AutocompleteInput validate={required()} />
                </ReferenceInput>
                <ReferenceInput source="product_id" reference="products">
                    <AutocompleteInput
                        optionText="reference"
                        validate={required()}
                    />
                </ReferenceInput>
                <DateInput
                    source="date"
                    defaultValue={new Date()}
                    validate={required()}
                />
                <StarRatingInput source="rating" defaultValue={2} />
                <TextInput
                    source="comment"
                    multiline
                    resettable
                    validate={required()}
                />
            </SimpleForm>
        </Create>
    );
};

export default ReviewCreate;
