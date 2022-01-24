import * as React from 'react';
import { useTranslate, SelectArrayInput, CommonInputProps } from 'react-admin';

import segments from '../segments/data';

interface Props extends Omit<CommonInputProps, 'source'> {
    source?: string;
}

const SegmentsInput = ({ addField, ...rest }: Props) => {
    const translate = useTranslate();
    return (
        <SelectArrayInput
            source="groups"
            {...rest}
            choices={segments.map(segment => ({
                id: segment.id,
                name: translate(segment.name),
            }))}
        />
    );
};

SegmentsInput.defaultProps = {
    source: 'groups',
    resource: 'customers',
};

export default SegmentsInput;
