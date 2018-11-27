import React, { Children, ReactElement, createContext, Component } from 'react';
import Polyglot from 'node-polyglot';
import { connect, MapStateToProps } from 'react-redux';
import defaultMessages from 'ra-language-english';
import defaultsDeep from 'lodash/defaultsDeep';
import { ReduxState } from '../types';
import {
    TranslationContextProps,
    TranslationContext,
} from './TranslationContext';

interface MappedProps {
    locale: string;
    messages: object;
}

interface State {
    contextValues: TranslationContextProps;
}

interface Props {
    children: ReactElement<any>;
}

interface ViewProps extends MappedProps, Props {}

/**
 * Creates a translation context, available to its children
 *
 * Must be called withing a Redux app.
 *
 * @example
 *     const MyApp = () => (
 *         <Provider store={store}>
 *             <TranslationProvider locale="fr" messages={messages}>
 *                 <!-- Child components go here -->
 *             </TranslationProvider>
 *         </Provider>
 *     );
 */
class TranslationProviderView extends Component<ViewProps, State> {
    constructor(props) {
        super(props);
        const { locale, messages } = props;
        const polyglot = new Polyglot({
            locale,
            phrases: defaultsDeep({}, messages, defaultMessages),
        });

        this.state = {
            contextValues: {
                locale,
                translate: polyglot.t.bind(polyglot),
            },
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.locale !== this.props.locale) {
            const { locale, messages } = this.props;

            const polyglot = new Polyglot({
                locale,
                phrases: defaultsDeep({}, messages, defaultMessages),
            });

            this.setState({
                contextValues: {
                    locale,
                    translate: polyglot.t.bind(polyglot),
                },
            });
        }
    }

    render() {
        const { children } = this.props;
        const { contextValues } = this.state;

        return (
            <TranslationContext.Provider value={contextValues}>
                {Children.only(children)}
            </TranslationContext.Provider>
        );
    }
}

const mapStateToProps: MapStateToProps<
    MappedProps,
    any,
    ReduxState
> = state => ({
    locale: state.i18n.locale,
    messages: state.i18n.messages,
});

const TranslationProvider = connect(mapStateToProps)(TranslationProviderView);

export default TranslationProvider;
