import React from 'react';
import inflection from 'inflection';
import Translate from '../i18n/Translate';

const FieldTitle = ({ resource, source, label, translate }) => (
    <span>
        {typeof label !== 'undefined' ?
            translate(label)
            :
            (typeof source !== 'undefined' ?
                translate(`resources.${resource}.fields.${source}`, { _: inflection.humanize(source) })
                :
                ''
            )
        }
    </span>
);

export default Translate(FieldTitle);
