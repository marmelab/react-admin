import * as React from 'react';
import { FunctionComponent, ReactElement, memo } from 'react';

import useTranslate from '../i18n/useTranslate';
import getFieldLabelTranslationArgs from './getFieldLabelTranslationArgs';

interface Props {
    isRequired?: boolean;
    resource?: string;
    source?: string;
    label?: string | ReactElement | false;
}

export const FieldTitle: FunctionComponent<Props> = ({
    resource,
    source,
    label,
    isRequired,
}) => {
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
            {isRequired && ' *'}
        </span>
    );
};

// What? TypeScript loses the displayName if we don't set it explicitly
FieldTitle.displayName = 'FieldTitle';

export default memo(FieldTitle);
