import React, { SFC } from 'react';
import inflection from 'inflection';
import pure from 'recompose/pure';
import compose from 'recompose/compose';

import translateHoc from '../i18n/translate';
import { Translate } from '../types';

interface Props {
    isRequired?: boolean;
    resource?: string;
    source?: string;
    label?: string;
    translate?: Translate;
}

export const FieldTitle: SFC<Props> = ({
    resource,
    source,
    label,
    isRequired,
    translate = (name: string, options) => name,
}) => (
    <span>
        {typeof label !== 'undefined'
            ? translate(label, { _: label })
            : typeof source !== 'undefined'
                ? translate(`resources.${resource}.fields.${source}`, {
                      _: inflection.transform(source, [
                          'underscore',
                          'humanize',
                      ]),
                  })
                : ''}
        {isRequired && ' *'}
    </span>
);

// wat? TypeScript looses the displayName if we don't set it explicitly
FieldTitle.displayName = 'FieldTitle';

const enhance = compose(
    translateHoc,
    pure
);

export default enhance(FieldTitle);
