import PropTypes from 'prop-types';
import { getContext } from 'recompose';

const translate = BaseComponent => {
    const TranslatedComponent = getContext({
        translate: PropTypes.func.isRequired,
        locale: PropTypes.string.isRequired,
    })(BaseComponent);

    TranslatedComponent.defaultProps = BaseComponent.defaultProps;

    return TranslatedComponent;
};

export default translate;
