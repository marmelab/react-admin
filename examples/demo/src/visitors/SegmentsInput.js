import React from 'react';
import { useTranslate, SelectArrayInput } from 'react-admin';

import segments from '../segments/data';

const SegmentsInput = ({ addField, ...rest }) => {
    const translate = useTranslate();
    return (
        <SelectArrayInput
            {...rest}
            choices={segments.map(segment => ({
                id: segment.id,
                name: translate(segment.name),
            }))}
        />
    );
};

SegmentsInput.defaultProps = {
    addField: true,
    source: 'groups',
};

export default SegmentsInput;
