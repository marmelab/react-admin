import { useCallback, ReactElement } from 'react';

import { useTranslate } from './useTranslate';
import { getFieldLabelTranslationArgs } from '../util';
import { useResourceContext, useSourceContext } from '../core';

export const useTranslateLabel = () => {
    const translate = useTranslate();
    const resourceFromContext = useResourceContext();
    const sourceContext = useSourceContext();

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
                    defaultLabel: sourceContext?.getLabel(source),
                    resource,
                    resourceFromContext,
                    source,
                })
            );
        },
        [resourceFromContext, translate, sourceContext]
    );
};
