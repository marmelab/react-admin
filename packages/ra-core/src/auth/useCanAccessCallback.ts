import {
    UseMutateAsyncFunction,
    useMutation,
    UseMutationOptions,
} from '@tanstack/react-query';
import useAuthProvider from './useAuthProvider';
import { HintedString } from '../types';

/**
 * A hook that returns a function you can call to determine whether user has access to the given resource
 *
 * @example
 *     import { Datagrid, List, TextField, useCanAccessCallback } from 'react-admin';
 *
 *     const UserList = () => {
 *         const checkAccess = useCanAccessCallback();
 *
 *         const handleRowClick = (id: Identifier, resource: string, record: Record) => {
 *             try {
 *                 const canAccess = checkAccess({ resource: 'users', action: 'edit', record });
 *                 return canAccess ? "edit" : "show";
 *             } catch (error) {
 *                 console.error(error);
 *             }
 *         };
 *
 *         return (
 *             <List>
 *                 <Datagrid onClick={handleRowClick}>
 *                     <TextField source="id" />
 *                     <TextField source="name" />
 *                     <TextField source="email" />
 *                 </Datagrid>
 *             </List>
 *         );
 *     };
 */
export const useCanAccessCallback = <
    RecordType extends Record<string, any> = Record<string, any>,
    ErrorType = Error,
>(
    options: Omit<
        UseMutationOptions<
            UseCanAccessCallbackResult,
            ErrorType,
            UseCanAccessCallbackOptions<RecordType>
        >,
        'mutationFn'
    > = {}
) => {
    const authProvider = useAuthProvider();

    const { mutateAsync } = useMutation<
        UseCanAccessCallbackResult,
        ErrorType,
        UseCanAccessCallbackOptions
    >({
        mutationFn: async (
            params: UseCanAccessCallbackOptions
        ): Promise<UseCanAccessCallbackResult> => {
            if (!authProvider || !authProvider.canAccess) {
                return true;
            }
            return authProvider.canAccess(params);
        },
        retry: false,
        ...options,
    });

    return mutateAsync;
};

export type UseCanAccessCallback<
    RecordType extends Record<string, any> = Record<string, any>,
    ErrorType = Error,
> = UseMutateAsyncFunction<
    UseCanAccessCallbackResult,
    ErrorType,
    UseCanAccessCallbackOptions<RecordType>,
    unknown
>;

export type UseCanAccessCallbackOptions<
    RecordType extends Record<string, any> = Record<string, any>,
> = {
    resource: string;
    action: HintedString<'list' | 'create' | 'edit' | 'show' | 'delete'>;
    record?: RecordType;
};

export type UseCanAccessCallbackResult = boolean;
