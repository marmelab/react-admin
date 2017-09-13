import React from 'react';
import PropTypes from 'prop-types';
import SelectInput from './SelectInput';
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
    addField: PropTypes.bool.isRequired,
    elStyle: PropTypes.object,
    input: PropTypes.object,
    label: PropTypes.string,
    meta: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
};

NullableBooleanInput.defaultProps = {
    addField: true,
};

export default translate(NullableBooleanInput);
