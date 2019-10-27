import React, { FunctionComponent } from 'react';
import pure from 'recompose/pure';

import useTranslate from '../i18n/useTranslate';
import getFieldLabelTranslationArgs from './getFieldLabelTranslationArgs';

interface Props {
    isRequired?: boolean;
    resource?: string;
    source?: string;
    label?: string;
}

export const FieldTitle: FunctionComponent<Props> = ({
    resource,
    source,
    label,
    isRequired,
}) => {
    const translate = useTranslate();
    return (
        <span>
            {translate(
                ...getFieldLabelTranslationArgs({ label, resource, source })
            )}
            {isRequired && ' *'}
        </span>
    );
};

// wat? TypeScript looses the displayName if we don't set it explicitly
FieldTitle.displayName = 'FieldTitle';

export default pure(FieldTitle);
