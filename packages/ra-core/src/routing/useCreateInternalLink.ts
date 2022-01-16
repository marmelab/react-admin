import { useCallback } from 'react';

import { Identifier } from '../types';
import { useBasename } from './useBasename';

export const useCreateInternalLink = () => {
    const basename = useBasename();
    return useCallback(
        ({ resource, id, type }: CreateInternalLinkParams): string => {
            switch (type) {
                case 'list':
                    return `${basename}/${resource}`;
                case 'create':
                    return `${basename}/${resource}/create`;
                case 'edit':
                    return `${basename}/${resource}/${encodeURIComponent(id)}`;
                case 'show':
                    return `${basename}/${resource}/${encodeURIComponent(
                        id
                    )}/show`;
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
