import { useCallback } from 'react';

import { Identifier } from '../types';
import { useBasename } from './useBasename';

/**
 * Get a callback to create a link to a given page in the admin app.
 *
 * The callback expects an object as parameter, containing the following properties:
 *   - type: 'list', 'edit', 'show' or 'create'
 *   - resource
 *   - id (optional), for 'edit' or 'show' pages
 *
 * This is used internally by react-admin to allow default components to work
 * in applications that are mounted on a sub path, e.g. '/admin'. If your app
 * is mounted in the root path, you don't need it, and you can create links by
 * hand, e.g. '/articles/1/show'.
 *
 * @example
 * import { useCreatePath, useRecordContext } from 'react-admin';
 * import { useNavigate } from 'react-router-dom';
 *
 * const PostEditButton = () => {
 *     const createPath = useCreatePath();
 *     const record = useRecordContext();
 *     const navigate = useNavigate();
 *
 *     const handleClick = () => {
 *         const link = createPath({
 *            type: 'edit',
 *            resource: 'posts',
 *            id: record.id
 *         });
 *         navigate(link);
 *     };
 *
 *    return <button onClick={handleClick}>Edit Post</button>;
 * };
 */
export const useCreatePath = () => {
    const basename = useBasename();
    return useCallback(
        ({ resource, id, type }: CreatePathParams): string => {
            switch (type) {
                case 'list':
                    return removeDoubleSlashes(`${basename}/${resource}`);
                case 'create':
                    return removeDoubleSlashes(
                        `${basename}/${resource}/create`
                    );
                case 'edit': {
                    if (id == null) {
                        // maybe the id isn't defined yet
                        // instead of throwing an error, fallback to list link
                        return removeDoubleSlashes(`${basename}/${resource}`);
                    }
                    return removeDoubleSlashes(
                        `${basename}/${resource}/${encodeURIComponent(id)}`
                    );
                }
                case 'show': {
                    if (id == null) {
                        // maybe the id isn't defined yet
                        // instead of throwing an error, fallback to list link
                        return removeDoubleSlashes(`${basename}/${resource}`);
                    }
                    return removeDoubleSlashes(
                        `${basename}/${resource}/${encodeURIComponent(id)}/show`
                    );
                }
                default:
                    return type;
            }
        },
        [basename]
    );
};

type AnyString = string & {};
export type CreatePathType = 'list' | 'edit' | 'show' | 'create' | AnyString;

export interface CreatePathParams {
    type: CreatePathType;
    resource: string;
    id?: Identifier;
}

export const removeDoubleSlashes = (path: string) => path.replace('//', '/');
