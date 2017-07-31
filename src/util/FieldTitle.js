import React from 'react';
import PropTypes from 'prop-types';
import inflection from 'inflection';
import pure from 'recompose/pure';
import compose from 'recompose/compose';

import translate from '../i18n/translate';

const expand = path => path.replace(/\[\d+\]\./g, '.fields.');
const humanize = path => inflection.humanize(path.split('.').pop());

export const FieldTitle = ({
    resource,
    source,
    label,
    isRequired,
    translate,
}) =>
    <span>
        {typeof label !== 'undefined'
            ? translate(expand(label), { _: humanize(label) })
            : typeof source !== 'undefined'
              ? translate(`resources.${resource}.fields.${expand(source)}`, {
                    _: humanize(source),
                })
              : ''}
        {isRequired && ' *'}
    </span>;

FieldTitle.propTypes = {
    isRequired: PropTypes.bool,
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
