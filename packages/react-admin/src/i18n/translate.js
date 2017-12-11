import PropTypes from 'prop-types';
import { getContext } from 'recompose';

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
    const TranslatedComponent = getContext({
        translate: PropTypes.func.isRequired,
        locale: PropTypes.string.isRequired,
    })(BaseComponent);

    TranslatedComponent.defaultProps = BaseComponent.defaultProps;

    return TranslatedComponent;
};

export default translate;
