import React from 'react';
import { useTranslate, SelectInput } from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';

import segments from '../segments/data';

const styles = {
    input: { width: 150 },
};

const SegmentInput = ({ classes, ...rest }) => {
    const translate = useTranslate();
    return (
        <SelectInput
            {...rest}
            choices={segments.map(segment => ({
                id: segment.id,
                name: translate(segment.name),
            }))}
            className={classes.input}
        />
    );
};

const TranslatedSegmentInput = withStyles(styles)(SegmentInput);

TranslatedSegmentInput.defaultProps = {
    source: 'groups',
};

export default TranslatedSegmentInput;
