import PropTypes from 'prop-types';

/**
 * Common PropTypes for all react-admin inputs
 */
export const InputPropTypes = {
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.element,
    ]),
    resource: PropTypes.string,
    source: PropTypes.string,
};
