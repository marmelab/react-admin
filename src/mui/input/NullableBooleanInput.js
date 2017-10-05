import React from 'react';
import PropTypes from 'prop-types';
import SelectInput from './SelectInput';
import compose from 'recompose/compose';

import addField from '../form/addField';
import translate from '../../i18n/translate';

export const NullableBooleanInput = ({
    input,
    meta,
    label,
    source,
    elStyle,
    resource,
    translate,
}) => (
    <SelectInput
        input={input}
        label={label}
        source={source}
        resource={resource}
        choices={[
            { id: null, name: '' },
            { id: false, name: translate('aor.boolean.false') },
            { id: true, name: translate('aor.boolean.true') },
        ]}
        meta={meta}
        style={elStyle}
    />
);

NullableBooleanInput.propTypes = {
    elStyle: PropTypes.object,
    input: PropTypes.object,
    label: PropTypes.string,
    meta: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
};

export default compose(addField, translate)(NullableBooleanInput);
