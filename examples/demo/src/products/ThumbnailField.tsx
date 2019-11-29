import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FieldProps, Product } from '../types';

const useStyles = makeStyles({
    root: { width: 25, maxWidth: 25, maxHeight: 25 },
});

const ThumbnailField = ({ record }: FieldProps<Product>) => {
    const classes = useStyles();
    return record ? (
        <img src={record.thumbnail} className={classes.root} alt="" />
    ) : null;
};

export default ThumbnailField;
