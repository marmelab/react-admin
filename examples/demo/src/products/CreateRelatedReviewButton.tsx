import * as React from 'react';
import { CreateButton, useRecordContext } from 'react-admin';

const CreateRelatedReviewButton = () => {
    const record = useRecordContext();

    return (
        <CreateButton
            to={{
                pathname: '/reviews/create',
            }}
            state={{ record: { product_id: record.id } }}
        />
    );
};

export default CreateRelatedReviewButton;
