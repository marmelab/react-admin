import { To } from 'react-router-dom';

/**
 * @deprecated use useCreateInternalLink instead
 */
export const resolveRedirectTo = (
    redirectTo,
    resource: string,
    id?,
    data?,
    basename: string = ''
): To => {
    if (typeof redirectTo === 'function') {
        const target: To = redirectTo(resource, id, data);
        return typeof target === 'string'
            ? `${basename}/${target}`
            : {
                  pathname: `${basename}/${target.pathname}`,
                  ...target,
              };
    }
    switch (redirectTo) {
        case 'list':
            return `${basename}/${resource}`;
        case 'create':
            return `${basename}/${resource}/create`;
        case 'edit':
            return `${basename}/${resource}/${encodeURIComponent(id)}`;
        case 'show':
            return `${basename}/${resource}/${encodeURIComponent(id)}/show`;
        default:
            return redirectTo;
    }
};
