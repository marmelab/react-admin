import React from 'react';
import { EditController, LongTextInput, SimpleForm } from 'react-admin';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import CloseIcon from '@material-ui/icons/Close';

import StarRatingField from './StarRatingField';
import ReviewEditToolbar from './ReviewEditToolbar';

const editStyle = {
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
        width: 400,
    },
};

const ReviewEdit = ({ classes, onCancel, ...props }) => (
    <EditController {...props}>
        {controllerProps =>
            controllerProps.record ? (
                <div className={classes.root}>
                    <div className={classes.title}>
                        <Typography variant="title">Review detail</Typography>
                        <IconButton onClick={onCancel}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <SimpleForm
                        className={classes.form}
                        {...controllerProps}
                        toolbar={<ReviewEditToolbar />}
                    >
                        <StarRatingField />
                        <LongTextInput source="comment" rowsMax={10} />
                    </SimpleForm>
                </div>
            ) : null
        }
    </EditController>
);

export default withStyles(editStyle)(ReviewEdit);
