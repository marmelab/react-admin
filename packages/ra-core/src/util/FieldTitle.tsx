import * as React from 'react';
import { ReactElement, memo } from 'react';

import { useTranslate } from '../i18n';
import getFieldLabelTranslationArgs from './getFieldLabelTranslationArgs';
import { useResourceContext } from '../core/useResourceContext';

export interface FieldTitleProps {
    isRequired?: boolean;
    resource?: string;
    source?: string;
    label?: string | ReactElement | false;
}

export const FieldTitle = (props: FieldTitleProps) => {
    const { source, label, isRequired } = props;
    const resource = useResourceContext(props);
    const translate = useTranslate();

    if (label === false || label === '') {
        return null;
    }

    if (label && typeof label !== 'string') {
        return label;
    }

    return (
        <span>
            {translate(
                ...getFieldLabelTranslationArgs({
                    label: label as string,
                    resource,
                    source,
                })
            )}
            {isRequired && <span aria-hidden="true">&thinsp;*</span>}
        </span>
    );
};

// What? TypeScript loses the displayName if we don't set it explicitly
FieldTitle.displayName = 'FieldTitle';

export default memo(FieldTitle);
