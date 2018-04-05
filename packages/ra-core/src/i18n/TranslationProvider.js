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
import { createStructuredSelector } from 'reselect';
import defaultMessages from 'ra-language-intl/translation/en.json';

import { selectLocale, selectMessages } from './selectors';

const TranslationProviderTranslateContext = props =>
  Children.only(props.children);

const withI18nContext = withContext(
  {
    translate: PropTypes.func.isRequired,
  },
  props => {
    return {
      translate: (id, opts) => props.intl.formatMessage({ id }, opts),
    };
  }
);

const ConnectedTranslationProvider = compose(injectIntl, withI18nContext)(
  TranslationProviderTranslateContext
);

export const TranslationProvider = props => (
  <IntlProvider
    locale={props.locale}
    key={props.locale}
    messages={props.messages || defaultMessages}
  >
    <ConnectedTranslationProvider>
      {props.children}
    </ConnectedTranslationProvider>
  </IntlProvider>
);

TranslationProvider.defaultProps = {
  locale: 'en',
};

TranslationProvider.propTypes = {
  locale: PropTypes.string,
  messages: PropTypes.object,
  children: PropTypes.element.isRequired,
};

const mapStateToProps = createStructuredSelector({
  locale: selectLocale,
  messages: selectMessages,
});

const withI18nContextTranslationProvider = withContext(
  {
    locale: PropTypes.string.isRequired,
    messages: PropTypes.object,
  },
  props => {
    return {
      locale: props.locale,
      messages: props.messages,
    };
  }
);

export default compose(
  connect(mapStateToProps),
  withI18nContextTranslationProvider
)(TranslationProvider);
