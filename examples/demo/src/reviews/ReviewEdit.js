import React from 'react';
import {
    DateField,
    Edit,
    LongTextInput,
    ReferenceField,
    SelectInput,
    SimpleForm,
    TextField,
} from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';

import ProductReferenceField from '../products/ProductReferenceField';
import CustomerReferenceField from '../visitors/CustomerReferenceField';
import StarRatingField from './StarRatingField';
import ReviewEditActions from './ReviewEditActions';

const editStyle = {
    detail: {
        display: 'inline-block',
        verticalAlign: 'top',
        marginRight: '2em',
        minWidth: '8em',
    },
};

const ReviewEdit = withStyles(editStyle)(({ classes, ...props }) => (
    <Edit {...props} actions={<ReviewEditActions />}>
        <SimpleForm>
            <DateField source="date" formClassName={classes.detail} />
            <CustomerReferenceField formClassName={classes.detail} />
            <ProductReferenceField formClassName={classes.detail} />
            <ReferenceField
                source="command_id"
                reference="commands"
                addLabel
                formClassName={classes.detail}
            >
                <TextField source="reference" />
            </ReferenceField>
            <StarRatingField formClassName={classes.detail} />
            <LongTextInput source="comment" />
            <SelectInput
                source="status"
                choices={[
                    { id: 'accepted', name: 'Accepted' },
                    { id: 'pending', name: 'Pending' },
                    { id: 'rejected', name: 'Rejected' },
                ]}
            />
        </SimpleForm>
    </Edit>
));

export default ReviewEdit;
