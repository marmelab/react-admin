import React from 'react';
import { translate, SelectInput } from 'react-admin';
import { withStyles } from 'material-ui/styles';
import compose from 'recompose/compose';

import segments from '../segments/data';

const styles = {
    input: { width: 150 },
};

const SegmentInput = ({ translate, classes, ...rest }) => (
    <SelectInput
        {...rest}
        choices={segments.map(segment => ({
            id: segment.id,
            name: translate(segment.name),
        }))}
        className={classes.input}
    />
);

const TranslatedSegmentInput = compose(withStyles(styles), translate)(
    SegmentInput
);

TranslatedSegmentInput.defaultProps = {
    addLabel: true,
    source: 'groups',
};

export default TranslatedSegmentInput;
