import { useEffect } from 'react';
import { usePreferencesEditor } from './usePreferencesEditor';

/**
 * Set inspector title on mount
 *
 * @example
 * useSetInspectorTitle('Datagrid');
 */
export const useSetInspectorTitle = (title: string, options?: any) => {
    const { setTitle } = usePreferencesEditor();

    useEffect(() => {
        setTitle(title, options);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title, JSON.stringify(options), setTitle]);
};
