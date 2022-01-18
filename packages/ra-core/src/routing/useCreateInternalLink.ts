import { useCallback } from 'react';

import { Identifier } from '../types';
import { useBasename } from './useBasename';

export const useCreateInternalLink = () => {
    const basename = useBasename();
    return useCallback(
        ({ resource, id, type }: CreateInternalLinkParams): string => {
            switch (type) {
                case 'list':
                    return removeDoubleSlashes(`${basename}/${resource}`);
                case 'create':
                    return removeDoubleSlashes(
                        `${basename}/${resource}/create`
                    );
                case 'edit':
                    return removeDoubleSlashes(
                        `${basename}/${resource}/${encodeURIComponent(id)}`
                    );
                case 'show':
                    return removeDoubleSlashes(
                        `${basename}/${resource}/${encodeURIComponent(id)}/show`
                    );
                default:
                    return type;
            }
        },
        [basename]
    );
};

export interface CreateInternalLinkParams {
    type: string;
    resource: string;
    id?: Identifier;
}

const removeDoubleSlashes = (path: string) => path.replace('//', '/');
