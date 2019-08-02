import {
    useField as useFinalFormField,
    FieldProps as FinalFormFieldProps,
    FieldRenderProps,
} from 'react-final-form';
import { Validator, composeValidators } from './validate';
import isRequired from './isRequired';

interface Options
    extends Omit<FinalFormFieldProps<any, HTMLElement>, 'validate'> {
    source: string;
    name?: string;
    id?: string;
    defaultValue?: any;
    validate?: Validator | Validator[];
}

interface FieldProps extends FieldRenderProps<any, HTMLElement> {
    id: string;
    isRequired: boolean;
}

const useField = ({
    defaultValue,
    id,
    name,
    source,
    validate,
    ...options
}: Options): FieldProps => {
    const finalName = name || source;

    const sanitizedValidate = Array.isArray(validate)
        ? composeValidators(validate)
        : validate;

    const fieldProps = useFinalFormField(finalName, {
        initialValue: defaultValue,
        validate: sanitizedValidate,
        ...options,
    });

    return {
        ...fieldProps,
        id: id || source,
        isRequired: isRequired(validate),
    };
};

export default useField;
