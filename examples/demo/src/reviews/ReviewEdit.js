import React from 'react';
import { EditController, LongTextInput, SimpleForm, DateField } from 'react-admin';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import CloseIcon from '@material-ui/icons/Close';

import ProductReferenceField from '../products/ProductReferenceField';
import CustomerReferenceField from '../visitors/CustomerReferenceField';
import StarRatingField from './StarRatingField';
import ReviewEditToolbar from './ReviewEditToolbar';

const editStyle = theme => ({
    root: {
        paddingTop: 40,
    },
    title: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '1em',
    },
    form: {
        [theme.breakpoints.up('xs')]: {
            width: 400,
        },
        [theme.breakpoints.down('xs')]: {
            width: '100vw',
            marginTop: -30,
        },
    },
    inlineField: {
        display: 'inline-block',
        width: '50%',
    },
});

const ReviewEdit = ({ classes, onCancel, ...props }) => (
    <EditController {...props}>
        {controllerProps =>
            controllerProps.record ? (
                <div className={classes.root}>
                    <div className={classes.title}>
                        <Typography variant="title">{controllerProps.translate('resources.reviews.detail')}</Typography>
                        <IconButton onClick={onCancel}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <SimpleForm
                        className={classes.form}
                        basePath={controllerProps.basePath}
                        record={controllerProps.record}
                        save={controllerProps.save}
                        version={controllerProps.version}
                        redirect="list"
                        resource="reviews"
                        toolbar={<ReviewEditToolbar />}
                    >
                        <CustomerReferenceField formClassName={classes.inlineField} />

                        <ProductReferenceField formClassName={classes.inlineField} />
                        <DateField source="date" formClassName={classes.inlineField} />
                        <StarRatingField formClassName={classes.inlineField} />
                        <LongTextInput source="comment" rowsMax={15} />
                    </SimpleForm>
                </div>
            ) : null
        }
    </EditController>
);

export default withStyles(editStyle)(ReviewEdit);
