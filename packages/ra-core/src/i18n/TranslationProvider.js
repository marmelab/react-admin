/*
 *
 * TranslationProvider
 *
 * this component connects the redux state language locale to the
 * IntlProvider component and i18n messages (loaded from `app/translations`)
 */

import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, IntlProvider } from 'react-intl';
import { compose, withContext } from 'recompose';
import defaultMessages from '@yeutech/ra-language-intl/translation/en.json';

const TranslationProviderTranslateContext = props =>
    Children.only(props.children);

const withI18nContext = withContext(
    {
        translate: PropTypes.func.isRequired,
    },
    ({ intl, messages }) => {
        return {
            translate: (id, opts) =>
                intl.formatMessage({ id, defaultMessage: messages[id] }, opts),
        };
    }
);

const ConnectedTranslationProvider = compose(injectIntl, withI18nContext)(
    TranslationProviderTranslateContext
);

export const TranslationProvider = props => (
    <IntlProvider
        locale={props.locale}
        messages={props.messages || defaultMessages}
    >
        <ConnectedTranslationProvider
            messages={props.messages || defaultMessages}
        >
            {props.children}
        </ConnectedTranslationProvider>
    </IntlProvider>
);

TranslationProvider.propTypes = {
    locale: PropTypes.string.isRequired,
    messages: PropTypes.object,
    children: PropTypes.element.isRequired,
};

const mapStateToProps = state => ({
    locale: state.i18n.locale,
    messages: state.i18n.messages,
});

const withI18nContextTranslationProvider = withContext(
    {
        locale: PropTypes.string.isRequired,
    },
    ({ locale }) => {
        return {
            locale,
        };
    }
);

export default compose(
    connect(mapStateToProps),
    withI18nContextTranslationProvider
)(TranslationProvider);
