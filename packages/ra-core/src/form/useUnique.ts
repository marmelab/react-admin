import merge from 'lodash/merge';
import { useResourceContext } from '../core';
import { useDataProvider } from '../dataProvider';
import { useTranslate, useTranslateLabel } from '../i18n';
import { InputProps } from './useInput';
import { useCallback, useRef } from 'react';
import set from 'lodash/set';
import { asyncDebounce } from '../util';
import { useRecordContext } from '../controller';

/**
 * A hook that returns a validation function checking for a record field uniqueness
 * by calling the dataProvider getList function with a filter.
 *
 * @example // Passing options at declaration time
 * const UserCreateForm = () => {
 *     const unique = useUnique({ message: 'Username is already used'});
 *     return (
 *         <SimpleForm>
 *             <TextInput source="username" validate={unique()} />
 *         </SimpleForm>
 *     );
 * }
 *
 * @example // Passing options at call time
 * const UserCreateForm = () => {
 *     const unique = useUnique();
 *     return (
 *         <SimpleForm>
 *             <TextInput source="username" validate={unique({ message: 'Username is already used'})} />
 *         </SimpleForm>
 *     );
 * }
 *
 * @example // With additional filters
 * const UserCreateForm = () => {
 *     const unique = useUnique();
 *     return (
 *         <SimpleForm>
 *             <ReferenceInput source="organization_id" reference="organizations" />
 *             <FormDataConsumer>
 *                 {({ formData }) => (
 *                     <TextInput
 *                         source="username"
 *                         validate={unique({ filter: { organization_id: formData.organization_id })}
 *                     />
 *                 )}
 *             </FormDataConsumer>
 *         </SimpleForm>
 *     );
 * }
 */
export const useUnique = (options?: UseUniqueOptions) => {
    const dataProvider = useDataProvider();
    const translateLabel = useTranslateLabel();
    const resource = useResourceContext(options);
    const translate = useTranslate();
    const record = useRecordContext();

    const debouncedGetList = useRef(
        // The initial value is here to set the correct type on useRef
        asyncDebounce(
            dataProvider.getList,
            options?.debounce ?? DEFAULT_DEBOUNCE
        )
    );

    const validateUnique = useCallback(
        (callTimeOptions?: UseUniqueOptions) => {
            const { message, filter, debounce: interval } = merge<
                UseUniqueOptions,
                any,
                any
            >(
                {
                    debounce: DEFAULT_DEBOUNCE,
                    filter: {},
                    message: 'ra.validation.unique',
                },
                options,
                callTimeOptions
            );

            debouncedGetList.current = asyncDebounce(
                dataProvider.getList,
                interval
            );

            return async (value: any, allValues: any, props: InputProps) => {
                try {
                    const finalFilter = set(
                        merge({}, filter),
                        props.source,
                        value
                    );
                    const { data, total } = await debouncedGetList.current(
                        resource,
                        {
                            filter: finalFilter,
                            pagination: { page: 1, perPage: 1 },
                            sort: { field: 'id', order: 'ASC' },
                        }
                    );

                    if (total > 0 && !data.some(r => r.id === record?.id)) {
                        return translate(message, {
                            _: message,
                            source: props.source,
                            value,
                            field: translateLabel({
                                label: props.label,
                                source: props.source,
                                resource,
                            }),
                        });
                    }
                } catch (error) {
                    return translate('ra.notification.http_error');
                }

                return undefined;
            };
        },
        [dataProvider, options, record, resource, translate, translateLabel]
    );

    return validateUnique;
};

const DEFAULT_DEBOUNCE = 1000;

export type UseUniqueOptions = {
    debounce?: number;
    resource?: string;
    message?: string;
    filter?: Record<string, any>;
};
