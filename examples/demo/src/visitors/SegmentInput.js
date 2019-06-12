import React from 'react';
import { useTranslate, SelectInput } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

import segments from '../segments/data';

const useStyles = makeStyles({
    input: { width: 150 },
});

const SegmentInput = props => {
    const translate = useTranslate();
    const classes = useStyles();
    return (
        <SelectInput
            {...props}
            choices={segments.map(segment => ({
                id: segment.id,
                name: translate(segment.name),
            }))}
            className={classes.input}
        />
    );
};

SegmentInput.defaultProps = {
    source: 'groups',
};

export default SegmentInput;
