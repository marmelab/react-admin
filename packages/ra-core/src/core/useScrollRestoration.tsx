import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';

/**
 * Scroll the page to top when the route changes.
 *
 * Used by default in react-admin <List>, <Edit>, <Create> and <Show>
 * components. Not used anywhere else by default (so e.g. <ListBase> does not
 * use it).
 *
 * @see https://reactrouter.com/web/guides/scroll-restoration
 *
 * @example
 *
 * import { ListBase, useScrollRestoration } from 'react-admin';
 *
 * const MyList = props => {
 *     useScrollRestoration();
 *     return (
 *         <ListBase {...props}>
 *             ...
 *         </ListBase>
 *     )
 * };
 *
 * @param disabled Set to true to disable scroll to top. Required by the rules of hooks.
 */
export const useScrollRestoration = (disabled?: boolean): void => {
    const history = useHistory();
    useEffect(() => {
        if (
            history.action !== 'POP' &&
            typeof window != 'undefined' &&
            !disabled
        ) {
            window.scrollTo(0, 0);
        }
    }, [
        history.action,
        history.location.pathname,
        history.location.search,
        disabled,
    ]);
};
