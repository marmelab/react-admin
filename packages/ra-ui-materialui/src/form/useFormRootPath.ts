import { useLocation, useMatchPath } from 'ra-core';

/**
 * This hook infers the tabbed form root path from the current location.
 */
export const useFormRootPath = () => {
    const location = useLocation();
    const matchPath = useMatchPath();
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
