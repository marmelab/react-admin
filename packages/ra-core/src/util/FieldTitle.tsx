import * as React from 'react';
import { ReactElement, memo } from 'react';

import { useTranslateLabel } from '../i18n';

export interface FieldTitleProps {
    isRequired?: boolean;
    resource?: string;
    source?: string;
    label?: string | ReactElement | boolean;
}

export const FieldTitle = (props: FieldTitleProps) => {
    const { source, label, resource, isRequired } = props;
    const translateLabel = useTranslateLabel();

    if (label === true) {
        throw new Error(
            'Label parameter must be a string, a ReactElement or false'
        );
    }

    if (label === false || label === '') {
        return null;
    }

    if (label && typeof label !== 'string') {
        return label;
    }

    return (
        <span>
            {translateLabel({
                label,
                resource,
                source,
            })}
            {isRequired && <span aria-hidden="true">&thinsp;*</span>}
        </span>
    );
};

// What? TypeScript loses the displayName if we don't set it explicitly
FieldTitle.displayName = 'FieldTitle';

export default memo(FieldTitle);
