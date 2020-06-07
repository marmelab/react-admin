import * as React from 'react';
import { ComponentType } from 'react';
import { default as warning } from '../util/warning';
import useTranslate from './useTranslate';
import useLocale from './useLocale';

/**
 * Higher-Order Component for getting access to the `locale` and the `translate` function in props.
 *
 * Requires that the app is decorated by the <TranslationProvider> to inject
 * the translation dictionaries and function in the context.
 *
 * @example
 *     import * as React from "react";
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
const withTranslate = (BaseComponent: ComponentType): ComponentType => {
    warning(
        typeof BaseComponent === 'string',
        `The translate function is a Higher Order Component, and should not be called directly with a translation key. Use the translate function passed as prop to your component props instead:

const MyHelloButton = ({ translate }) => (
    <button>{translate('myroot.hello.world')}</button>
);`
    );

    const TranslatedComponent = props => {
        const translate = useTranslate();
        const locale = useLocale();

        return (
            <BaseComponent {...props} translate={translate} locale={locale} />
        );
    };

    TranslatedComponent.defaultProps = BaseComponent.defaultProps;

    return TranslatedComponent;
};

export default withTranslate;
