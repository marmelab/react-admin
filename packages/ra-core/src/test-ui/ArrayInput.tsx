import * as React from 'react';
import { isRequired } from '../form/validation/validate';
import { InputProps } from '../form/useInput';
import { FieldTitle } from '../util/FieldTitle';
import { ArrayInputBase } from '../controller/input/ArrayInputBase';

export const ArrayInput = (props: ArrayInputProps) => {
    const {
        label,
        children,
        resource: resourceFromProps,
        source: arraySource,
        validate,
    } = props;

    return (
        <div>
            <div>
                <FieldTitle
                    label={label}
                    source={arraySource}
                    resource={resourceFromProps}
                    isRequired={isRequired(validate)}
                />
            </div>
            <ArrayInputBase {...props}>{children}</ArrayInputBase>
        </div>
    );
};

export interface ArrayInputProps
    extends Omit<InputProps, 'disabled' | 'readOnly'> {
    className?: string;
    children: React.ReactNode;
    isFetching?: boolean;
    isLoading?: boolean;
    isPending?: boolean;
}
