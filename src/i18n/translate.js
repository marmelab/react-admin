import React, { Component } from 'react';
import PropTypes from 'prop-types';

const translate = BaseComponent => {
    class TranslatedComponent extends Component {
        render() {
            const props = { ...this.context, ...this.props };
            return <BaseComponent {...props} />;
        }
    }

    const { translate, ...defaultProps } = BaseComponent.defaultProps || {};
    TranslatedComponent.defaultProps = defaultProps;
    TranslatedComponent.contextTypes = {
        translate: PropTypes.func.isRequired,
        locale: PropTypes.string.isRequired,
    };
    TranslatedComponent.displayName = `TranslatedComponent(${BaseComponent.displayName})`;

    return TranslatedComponent;
};

export default translate;
