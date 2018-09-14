import React, { Component } from 'react';
import PropTypes from 'prop-types';
import wrapDisplayName from 'recompose/wrapDisplayName';
import warning from '../util/warning';

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
    warning(
        typeof BaseComponent === 'string',
        `The translate function is an Higher Order Component and should not be called directly with a translation key. Use the translate function this HOC adds to your component props instead:

const MyHelloButton = ({ translate }) => (
    <button>{translate('myroot.hello.world')}</button>
);`
    );

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
    TranslatedComponent.displayName = wrapDisplayName(
        BaseComponent,
        'translate'
    );

    return TranslatedComponent;
};

export default translate;
