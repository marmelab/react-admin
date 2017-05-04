import React from 'react';
import PropTypes from 'prop-types';
import inflection from 'inflection';
import pure from 'recompose/pure';
import compose from 'recompose/compose';

import translate from '../i18n/translate';

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

FieldTitle.defaultProps = {
    translate: x => x,
};

const enhance = compose(pure, translate);

export default enhance(FieldTitle);
