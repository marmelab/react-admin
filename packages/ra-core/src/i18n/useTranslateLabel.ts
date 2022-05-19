import { useCallback, ReactElement } from 'react';

import { useTranslate } from './useTranslate';
import { useLabelPrefix, getFieldLabelTranslationArgs } from '../util';
import { useResourceContext } from '../core';

export const useTranslateLabel = () => {
    const translate = useTranslate();
    const prefix = useLabelPrefix();
    const resourceFromContext = useResourceContext();

    return useCallback(
        ({
            source,
            label,
            resource,
        }: {
            source?: string;
            label?: string | false | ReactElement;
            resource?: string;
        }) => {
            if (label === false || label === '') {
                return null;
            }

            if (label && typeof label !== 'string') {
                return label;
            }

            return translate(
                ...getFieldLabelTranslationArgs({
                    label: label as string,
                    prefix,
                    resource,
                    resourceFromContext,
                    source,
                })
            );
        },
        [prefix, resourceFromContext, translate]
    );
};
