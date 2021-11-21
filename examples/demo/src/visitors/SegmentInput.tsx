import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useTranslate, SelectInput, InputProps } from 'react-admin';

import segments from '../segments/data';

const StyledSelectInput = styled(SelectInput)({
    '&': { width: 150 },
});

interface Props extends Omit<InputProps, 'source'> {
    source?: string;
}

const SegmentInput = (props: Props) => {
    const translate = useTranslate();

    return (
        <StyledSelectInput
            {...props}
            choices={segments.map(segment => ({
                id: segment.id,
                name: translate(segment.name),
            }))}
        />
    );
};

SegmentInput.defaultProps = {
    source: 'groups',
};

export default SegmentInput;
