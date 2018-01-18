import React from 'react';
import { translate, SelectInput } from 'react-admin';

import segments from '../segments/data';

const SegmentInput = ({ translate, ...rest }) => (
    <SelectInput
        {...rest}
        choices={segments.map(segment => ({
            id: segment.id,
            name: translate(segment.name),
        }))}
        elStyle={{ width: 150 }}
    />
);

const TranslatedSegmentInput = translate(SegmentInput);

TranslatedSegmentInput.defaultProps = {
    addLabel: true,
    addField: true,
    source: 'groups',
};

export default TranslatedSegmentInput;
