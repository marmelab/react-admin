import { useLocation } from './useLocation';
import { useParams } from './useParams';

/**
 * Utility hook to get the base path of a splat path.
 * Compatible both with react-router v6 and v7.
 *
 * Example:
 * If a splat path is defined as `/posts/:id/show/*`,
 * and the current location is `/posts/12/show/3`,
 * this hook will return `/posts/12/show`.
 *
 * Solution inspired by
 * https://github.com/remix-run/react-router/issues/11052#issuecomment-1828470203
 */
export const useSplatPathBase = () => {
    const location = useLocation();
    const params = useParams();
    const splat = params['*'] ?? '';
    // The router decodes the splat but not the pathname: find the shortest
    // end of the pathname that is the splat once decoded
    const segments = location.pathname.split('/');
    for (let index = segments.length - 1; index > 0; index--) {
        if (isSplat(segments.slice(index).join('/'), splat)) {
            return segments.slice(0, index).join('/');
        }
    }
    return location.pathname;
};

// react-router leaves a malformed pathname undecoded, and keeps the slashes
// of decoded segments as %2F
const isSplat = (pathnameEnd: string, splat: string) =>
    [pathnameEnd, safelyDecodeURIComponent(pathnameEnd)].some(
        value => value.replace(/%2F/g, '/') === splat.replace(/%2F/g, '/')
    );

const safelyDecodeURIComponent = (value: string) => {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
};
