import * as React from 'react';
import { useRecordContext, NumberField, NumberFieldProps } from 'react-admin';
import get from 'lodash/get';

const ColoredNumberField = (props: NumberFieldProps) => {
    const record = useRecordContext<any>(props);
    if (!record || !props.source) {
        return null;
    }
    return (get(record, props.source) as number) > 500 ? (
        <NumberField {...props} sx={{ color: 'red' }} />
    ) : (
        <NumberField {...props} />
    );
};

// @ts-ignore
ColoredNumberField.defaultProps = NumberField.defaultProps;

export default ColoredNumberField;
