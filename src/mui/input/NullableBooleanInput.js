import React from 'react';
import PropTypes from 'prop-types';
import SelectInput from './SelectInput';

import translate from '../../i18n/translate';

export const NullableBooleanInput = ({
    label,
    source,
    elStyle,
    resource,
    translate,
}) => (
    <SelectInput
        label={label}
        source={source}
        resource={resource}
        choices={[
            { id: null, name: '' },
            { id: false, name: translate('aor.boolean.false') },
            { id: true, name: translate('aor.boolean.true') },
        ]}
        style={elStyle}
    />
);

NullableBooleanInput.propTypes = {
    elStyle: PropTypes.object,
    input: PropTypes.object,
    label: PropTypes.string,
    resource: PropTypes.string,
    source: PropTypes.string,
    translate: PropTypes.func.isRequired,
};

// don't decorate with addField HOC as SelectInput is already decorated.
export default translate(NullableBooleanInput);
