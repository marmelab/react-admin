import * as React from 'react';
import { CreateButton, useRecordContext } from 'react-admin';

const CreateRelatedReviewButton = () => {
    const record = useRecordContext();

    return (
        <CreateButton
            resource="reviews"
            state={{ record: { product_id: record.id } }}
        />
    );
};

export default CreateRelatedReviewButton;
