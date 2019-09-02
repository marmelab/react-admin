import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: { width: 25, maxWidth: 25, maxHeight: 25 },
});

const ThumbnailField = ({ record }) => {
    const classes = useStyles();
    return <img src={record.thumbnail} className={classes.root} alt="" />;
};

export default ThumbnailField;
