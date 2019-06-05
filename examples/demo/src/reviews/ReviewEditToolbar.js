import React, { Fragment } from 'react';
import MuiToolbar from '@material-ui/core/Toolbar';
import withStyles from '@material-ui/core/styles/withStyles';

import { SaveButton, DeleteButton } from 'react-admin';
import AcceptButton from './AcceptButton';
import RejectButton from './RejectButton';

const styles = {
    root: {
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'space-between',
    },
};

const ReviewEditToolbar = ({ basePath, classes, handleSubmitWithRedirect, invalid, record, resource, saving }) => (
    <MuiToolbar className={classes.root}>
        {record.status === 'pending' ? (
            <Fragment>
                <AcceptButton record={record} />
                <RejectButton record={record} />
            </Fragment>
        ) : (
            <Fragment>
                <SaveButton
                    handleSubmitWithRedirect={handleSubmitWithRedirect}
                    invalid={invalid}
                    saving={saving}
                    redirect="list"
                    submitOnEnter={true}
                />
                <DeleteButton basePath={basePath} record={record} resource={resource} />
            </Fragment>
        )}
    </MuiToolbar>
);

export default withStyles(styles)(ReviewEditToolbar);
