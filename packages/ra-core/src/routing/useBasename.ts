import { useContext } from 'react';

import { BasenameContext } from './BasenameContext';

/**
 * Get the string to append to all links to the admin app.
 *
 * Useful when the app is mounted on a sub path, e.g. '/admin'.
 *
 * This hook is used internally by all react-admin components that
 * contain a link, and requires that the basename is set via the
 * `<BasenameContextProvider>` component (or via the `<Admin>` component,
 * which calls BasenameContextProvider internally).
 *
 * @see BasenameContextProvider
 *
 * @example
 * import { useBasename } from 'react-admin';
 *
 * const ArticleLink = ({ title, id }) => {
 *    const basename = useBasename();
 *    return <a href={`${basename}/articles/${id}`}>{title}</a>;
 * };
 */
export const useBasename = () => useContext(BasenameContext);
