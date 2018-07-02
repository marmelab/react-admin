import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Higher-Order Component for getting access to the `translate` function in props.
 *
 * Requires that the app is decorated by the <TranslationPRovider> to inject
 * the translation dictionaries and function in the context.
 *
 * @example
 *     import React from 'react';
 *     import { translate } from 'react-admin';
 *
 *     const MyHelloButton = ({ translate }) => (
 *         <button>{translate('myroot.hello.world')}</button>
 *     );
 *
 *     export default translate(MyHelloButton);
 *
 * @param {*} BaseComponent The component to decorate
 */
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
    TranslatedComponent.displayName = `TranslatedComponent(${
        BaseComponent.displayName
    })`;

    return TranslatedComponent;
};

export default translate;
