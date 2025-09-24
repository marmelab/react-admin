import { Children, isValidElement, useRef, type ReactNode } from 'react';
import { FormDataConsumer } from '../../form/FormDataConsumer';
import type { ArrayInputContextValue } from './ArrayInputContext';
import { useEvent } from '../../util';

export const useGetArrayInputNewItemDefaults = (
    fields: ArrayInputContextValue['fields']
) => {
    const initialDefaultValue = useRef<Record<string, unknown>>({});
    if (fields.length > 0) {
        const { id, ...rest } = fields[0];
        initialDefaultValue.current = rest;
        for (const k in initialDefaultValue.current)
            initialDefaultValue.current[k] = null;
    }

    return useEvent((inputs?: ReactNode) => {
        if (
            Children.count(inputs) === 1 &&
            isValidElement(Children.only(inputs)) &&
            // @ts-ignore
            !Children.only(inputs).props.source &&
            // Make sure it's not a FormDataConsumer
            // @ts-ignore
            Children.only(inputs).type !== FormDataConsumer
        ) {
            // ArrayInput used for an array of scalar values
            // (e.g. tags: ['foo', 'bar'])
            return '';
        }

        // ArrayInput used for an array of objects
        // (e.g. authors: [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Doe' }])
        const defaultValue = initialDefaultValue.current;
        Children.forEach(inputs, input => {
            if (
                isValidElement(input) &&
                input.type !== FormDataConsumer &&
                input.props.source
            ) {
                defaultValue[input.props.source] =
                    input.props.defaultValue ?? null;
            }
        });
        return defaultValue;
    });
};
