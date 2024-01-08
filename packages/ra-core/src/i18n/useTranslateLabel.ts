import { useCallback, ReactElement } from 'react';

import { useTranslate } from './useTranslate';
import { useLabelPrefix, getFieldLabelTranslationArgs } from '../util';
import { useResourceContext, useSourceContext } from '../core';

export const useTranslateLabel = () => {
    const translate = useTranslate();
    const prefix = useLabelPrefix();
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
            const finalSource = sourceContext?.getSource(source) ?? source;

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
                    prefix,
                    resource,
                    resourceFromContext,
                    source: finalSource,
                })
            );
        },
        [prefix, resourceFromContext, translate, sourceContext]
    );
};
