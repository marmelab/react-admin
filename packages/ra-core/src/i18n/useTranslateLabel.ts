import { useCallback, ReactElement } from 'react';

import { useTranslate } from './useTranslate';
import { getFieldLabelTranslationArgs } from '../util';
import { useResourceContext, useOptionalSourceContext } from '../core';

export const useTranslateLabel = () => {
    const translate = useTranslate();
    const resourceFromContext = useResourceContext();
    const sourceContext = useOptionalSourceContext();

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
                    defaultLabel: source
                        ? sourceContext?.getLabel(source)
                        : undefined,
                    resource,
                    resourceFromContext,
                    source,
                })
            );
        },
        [resourceFromContext, translate, sourceContext]
    );
};
