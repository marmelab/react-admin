import merge from 'lodash/merge';
import { useResourceContext } from '../core';
import { useDataProvider } from '../dataProvider';
import { useTranslate, useTranslateLabel } from '../i18n';
import { InputProps } from './useInput';

/**
 * A hook that returns a validation function checking for a record field uniqueness
 * by calling the dataProvider getList function with a filter.
 *
 * @example Passing options at declaration time
 * const UserCreateForm = () => {
 *     const unique = useUnique({ message: 'Username is already used'});
 *     return (
 *         <SimpleForm>
 *             <TextInput source="username" validate={unique()} />
 *         </SimpleForm>
 *     );
 * }
 *
 * @example Passing options at call time
 * const UserCreateForm = () => {
 *     const unique = useUnique();
 *     return (
 *         <SimpleForm>
 *             <TextInput source="username" validate={unique({ message: 'Username is already used'})} />
 *         </SimpleForm>
 *     );
 * }
 *
 * @example With additional filters
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
 *
 * @example With a custom message
 * const UserCreateForm = () => {
 *     const unique = useUnique();
 *     return (
 *         <SimpleForm>
 *             <TextInput source="username" validate={unique({ message: 'Username is already used')} />
 *         </SimpleForm>
 *     );
 * }
 */
export const useUnique = (options?: UseUniqueOptions) => {
    const dataProvider = useDataProvider();
    const translateLabel = useTranslateLabel();
    const resource = useResourceContext(
        typeof options === 'string' ? undefined : options
    );
    const translate = useTranslate();

    return (callTimeOptions?: UseUniqueOptions) => async (
        value: any,
        allValues: any,
        props: InputProps
    ) => {
        const { message, filter } = merge<UseUniqueOptions, any, any>(
            {
                filter: {},
                message: 'ra.validation.unique',
            },
            options,
            callTimeOptions
        );

        try {
            const { data } = await dataProvider.getList(resource, {
                filter: { ...filter, [props.source]: value },
                pagination: { page: 1, perPage: 1 },
                sort: { field: props.source, order: 'ASC' },
            });

            if (data.length > 0) {
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
};

export type UseUniqueOptions = {
    resource?: string;
    message?: string;
    filter?: Record<string, any>;
};
