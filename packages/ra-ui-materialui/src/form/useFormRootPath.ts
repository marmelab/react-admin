import { matchPath, useLocation } from 'react-router-dom';

/**
 * This hook infers the tabbed form root path from the current location.
 */
export const useFormRootPath = () => {
    const location = useLocation();
    const createMatch = matchPath(':resource/create/*', location.pathname);
    const editMatch = matchPath(':resource/:id/*', location.pathname);

    if (createMatch) {
        return createMatch.pathnameBase;
    }

    if (editMatch) {
        return editMatch.pathnameBase;
    }

    return '';
};
