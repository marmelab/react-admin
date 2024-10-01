import { useEffect } from 'react';
import { RaRecord } from '../types';
import {
    useCanAccess,
    UseCanAccessOptions,
    UseCanAccessResult,
} from './useCanAccess';
import { useNavigate } from 'react-router';

/**
 * A hook that calls the authProvider.canAccess() method for a provided resource and action (and optionally a record).
 * It redirects to the /access-denied page if the user doesn't have the required permissions.
 * It redirects to the /authentication-error page if the authProvider.canAccess throws an error.
 *
 * The return value updates according to the request state:
 *
 * - start: { isPending: true }
 * - success: { isPending: false }
 * - error: { error: [error from provider], isPending: false }
 *
 * Useful to enable or disable features based on users permissions.
 *
 * @param {Object} params Any params you want to pass to the authProvider
 * @param {string} params.resource The resource to check access for
 * @param {string} params.action The action to check access for
 * @param {Object} params.record Optional. The record to check access for
 *
 * @returns Return the react-query result.
 *
 * @example
 *     import { useRequireAccess } from 'react-admin';
 *
 *     const PostDetail = () => {
 *         const { isPending } = useRequireAccess({
 *             resource: 'posts',
 *             action: 'read',
 *         });
 *         if (isPending) {
 *             return null;
 *         }
 *
 *         return <PostEdit />;
 *     };
 */
export const useRequireAccess = <
    RecordType extends RaRecord | Omit<RaRecord, 'id'> = RaRecord,
    ErrorType extends Error = Error,
>(
    params: UseRequireAccessOptions<RecordType, ErrorType>
) => {
    const { canAccess, data, error, ...rest } = useCanAccess(params);
    const navigate = useNavigate();

    useEffect(() => {
        if (rest.isPending) return;

        if (canAccess === false) {
            navigate('/access-denied');
        }
    }, [canAccess, navigate, rest.isPending]);

    useEffect(() => {
        if (error) {
            navigate('/authentication-error');
        }
    }, [navigate, error]);

    return rest;
};

export type UseRequireAccessOptions<
    RecordType extends RaRecord | Omit<RaRecord, 'id'> = RaRecord,
    ErrorType extends Error = Error,
> = UseCanAccessOptions<RecordType, ErrorType>;

export type UseRequireAccessResult<ErrorType extends Error = Error> = Omit<
    UseCanAccessResult<ErrorType>,
    'canAccess' | 'data'
>;
