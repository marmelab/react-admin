import { To } from 'react-router-dom';

/**
 * @deprecated use useCreatePath instead
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
            ? removeDoubleSlashes(`${basename}/${target}`)
            : {
                  pathname: removeDoubleSlashes(
                      `${basename}/${target.pathname}`
                  ),
                  ...target,
              };
    }
    switch (redirectTo) {
        case 'list':
            return removeDoubleSlashes(`${basename}/${resource}`);
        case 'create':
            return removeDoubleSlashes(`${basename}/${resource}/create`);
        case 'edit':
            return removeDoubleSlashes(
                `${basename}/${resource}/${encodeURIComponent(id)}`
            );
        case 'show':
            return removeDoubleSlashes(
                `${basename}/${resource}/${encodeURIComponent(id)}/show`
            );
        default:
            return redirectTo;
    }
};

const removeDoubleSlashes = (path: string) => path.replace('//', '/');
