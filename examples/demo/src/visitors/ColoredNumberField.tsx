import * as React from 'react';
import { useRecordContext, NumberField, NumberFieldProps } from 'react-admin';

const ColoredNumberField = (props: NumberFieldProps) => {
    const record = useRecordContext(props);
    if (!record || !props.source) {
        return null;
    }
    return record[props.source] > 500 ? (
        <NumberField {...props} sx={{ color: 'red' }} />
    ) : (
        <NumberField {...props} />
    );
};

ColoredNumberField.defaultProps = NumberField.defaultProps;

export default ColoredNumberField;
