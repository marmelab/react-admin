import * as React from 'react';
import { FunctionComponent, ReactElement, memo } from 'react';

import useTranslate from '../i18n/useTranslate';
import getFieldLabelTranslationArgs from './getFieldLabelTranslationArgs';

interface Props {
    isRequired?: boolean;
    resource?: string;
    source?: string;
    label?: string | ReactElement;
}

export const FieldTitle: FunctionComponent<Props> = ({
    resource,
    source,
    label,
    isRequired,
}) => {
    const translate = useTranslate();
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
            {isRequired && ' *'}
        </span>
    );
};

// wat? TypeScript looses the displayName if we don't set it explicitly
FieldTitle.displayName = 'FieldTitle';

export default memo(FieldTitle);
