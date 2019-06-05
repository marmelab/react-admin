import React, { ComponentType, Component, ComponentClass } from 'react';
import { default as wrapDisplayName } from 'recompose/wrapDisplayName';
import { default as warning } from '../util/warning';
import { TranslationContextProps, TranslationContext } from './TranslationContext';

/**
 * Higher-Order Component for getting access to the `translate` function in props.
 *
 * Requires that the app is decorated by the <TranslationProvider> to inject
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
const withTranslate = <OriginalProps extends TranslationContextProps>(
    BaseComponent: ComponentType<OriginalProps>
): ComponentClass<OriginalProps> => {
    warning(
        typeof BaseComponent === 'string',
        `The translate function is a Higher Order Component, and should not be called directly with a translation key. Use the translate function passed as prop to your component props instead:

const MyHelloButton = ({ translate }) => (
    <button>{translate('myroot.hello.world')}</button>
);`
    );

    // tslint:disable-next-line:no-shadowed-variable
    const { translate: translateToDiscard, ...defaultProps } = (BaseComponent.defaultProps || {}) as any;

    class TranslatedComponent extends Component<OriginalProps> {
        static defaultProps = defaultProps;

        static displayName = wrapDisplayName(BaseComponent, 'translate');

        render() {
            return (
                <TranslationContext.Consumer>
                    {({ translate, locale }) => <BaseComponent translate={translate} locale={locale} {...this.props} />}
                </TranslationContext.Consumer>
            );
        }
    }

    return TranslatedComponent;
};

export default withTranslate;
