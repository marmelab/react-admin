import { useEffect } from 'react';
import { usePreferencesEditor } from './usePreferencesEditor';

/**
 * Set inspector title on mount
 *
 * @example
 * useSetInspectorTitle('Datagrid');
 */
export const useSetInspectorTitle = (title: string) => {
    const { setTitle } = usePreferencesEditor();

    useEffect(() => {
        setTitle(title);
    }, [title, setTitle]);
};
