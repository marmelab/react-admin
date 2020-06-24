import { useContext } from 'react';

import ListContext from './ListContext';
import { ListControllerProps } from './useListController';

/**
 * Hook to read the list controller props.
 *
 * Must be used within a <ListContext.Provider>
 */
const useListContext = (props?: any): ListControllerProps => {
    const context = useContext(ListContext);
    if (!context.resource) {
        /**
         * The element isn't inside a <ListContext.Provider>
         *
         * This may only happen when using Datagrid / SimpleList / SingleFieldList components
         * outside of a List / ReferenceManyField / ReferenceArrayField -
         * which isn't documented but tolerated.
         * To avoid breakage in that case, fallback to props
         *
         * @deprecated - to be removed in 4.0
         */
        if (process.env.NODE_ENV !== 'production') {
            console.log(
                "List components must be used inside a <ListContext.Provider>. Relying on props rather than context to get List data and callbacks is deprecated and won't be supported in the next major version of react-admin."
            );
        }
        return props;
    }
    return context;
};

export default useListContext;
