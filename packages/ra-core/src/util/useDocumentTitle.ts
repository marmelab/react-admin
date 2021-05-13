import { useEffect } from 'react';

/**
 * A hook that updates the document title whenever the argument changes
 * @example
 *
 * const MyComponent = (props => {
 *   useDocumentTitle(props.record && props.record.title);
 *   return <div...;
 * });
 *
 */
export function useDocumentTitle(title: string) {
    useEffect(() => {
        if (title) {
            document.title = title;
        }
    }, [title]);
}
