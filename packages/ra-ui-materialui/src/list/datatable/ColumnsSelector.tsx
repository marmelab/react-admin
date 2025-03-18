import * as React from 'react';
import { Children } from 'react';
import { createPortal } from 'react-dom';
import { DataTableRenderContext } from './context/DataTableRenderContext';
import { DataTableColumnRankContext } from './context/DataTableColumnRankContext';
import { useDataTableStoreContext } from './context/DataTableStoreContext';

/**
 * Render DataTable.Col elements in the ColumnsButton selector using a React POrtal.
 *
 * @see ColumnsButton
 */
export const ColumnsSelector = ({ children }: ColumnsSelectorProps) => {
    const { storeKey } = useDataTableStoreContext();
    const elementId = `${storeKey}-columnsSelector`;

    const [container, setContainer] = React.useState<HTMLElement | null>(() =>
        typeof document !== 'undefined'
            ? document.getElementById(elementId)
            : null
    );

    // on first mount, we don't have the container yet, so we wait for it
    React.useEffect(() => {
        if (
            container &&
            typeof document !== 'undefined' &&
            document.body.contains(container)
        )
            return;
        // look for the container in the DOM every 100ms
        const interval = setInterval(() => {
            const target = document.getElementById(elementId);
            if (target) setContainer(target);
        }, 100);
        // stop looking after 500ms
        const timeout = setTimeout(() => clearInterval(interval), 500);
        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [elementId, container]);

    if (!container) return null;

    return createPortal(
        <DataTableRenderContext.Provider value="columnsSelector">
            {Children.map(children, (element, index) => (
                <DataTableColumnRankContext.Provider value={index} key={index}>
                    {element}
                </DataTableColumnRankContext.Provider>
            ))}
        </DataTableRenderContext.Provider>,
        container
    );
};

interface ColumnsSelectorProps {
    children?: React.ReactNode;
}
