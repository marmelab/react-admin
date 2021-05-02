import { useEffect } from 'react';

/**
 * A hook that updates the document's title whenever the title argument changes
 * @example
 *
 * const MyComponent = (props => {
 *   const { title } = props.record;
 *
 *   useDocumentTitle(title);
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
