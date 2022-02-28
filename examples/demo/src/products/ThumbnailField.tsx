import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useRecordContext } from 'react-admin';
import { Product } from '../types';

const PREFIX = 'ThumbnailField';

const classes = {
    root: `${PREFIX}-root`,
};

const Root = styled('img')({
    [`&.${classes.root}`]: { width: 25, maxWidth: 25, maxHeight: 25 },
});

const ThumbnailField = () => {
    const record = useRecordContext<Product>();

    return record ? (
        <Root src={record.thumbnail} className={classes.root} alt="" />
    ) : null;
};

export default ThumbnailField;
