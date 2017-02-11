import React, { PropTypes } from 'react';
import inflection from 'inflection';
import pure from 'recompose/pure';
import compose from 'recompose/compose';

import Translate from '../i18n/Translate';

const FieldTitle = ({ resource, source, label, translate }) => (
    <span>
        {typeof label !== 'undefined' ?
            translate(label, { _: label })
            :
            (typeof source !== 'undefined' ?
                translate(`resources.${resource}.fields.${source}`, { _: inflection.humanize(source) })
                :
                ''
            )
        }
    </span>
);

FieldTitle.propTypes = {
    resource: PropTypes.string,
    source: PropTypes.string,
    label: PropTypes.string,
    translate: PropTypes.func.isRequired,
};

const enhance = compose(pure, Translate);

export default enhance(FieldTitle);
