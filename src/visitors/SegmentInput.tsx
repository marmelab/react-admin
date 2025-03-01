import * as React from 'react';
import { SelectInput, SelectInputProps } from 'react-admin';

import segments from '../segments/data';

const SegmentInput = (props: SelectInputProps) => (
    <SelectInput
        {...props}
        source="groups"
        translateChoice
        choices={segments}
    />
);

export default SegmentInput;
