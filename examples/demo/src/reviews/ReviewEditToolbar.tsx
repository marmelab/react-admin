import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Fragment } from 'react';
import MuiToolbar from '@mui/material/Toolbar';

import { SaveButton, DeleteButton, ToolbarProps } from 'react-admin';
import AcceptButton from './AcceptButton';
import RejectButton from './RejectButton';
import { Review } from '../types';

const PREFIX = 'ReviewEditToolbar';

const classes = {
    root: `${PREFIX}-root`,
};

const StyledMuiToolbar = styled(MuiToolbar)(({ theme }) => ({
    [`&.${classes.root}`]: {
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        justifyContent: 'space-between',
    },
}));

const ReviewEditToolbar = (props: ToolbarProps<Review>) => {
    const {
        basePath,
        handleSubmitWithRedirect,
        invalid,
        record,
        resource,
        saving,
    } = props;

    if (!record) return null;
    return (
        <StyledMuiToolbar className={classes.root}>
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
                    <DeleteButton
                        basePath={basePath}
                        record={record}
                        resource={resource}
                    />
                </Fragment>
            )}
        </StyledMuiToolbar>
    );
};

export default ReviewEditToolbar;
