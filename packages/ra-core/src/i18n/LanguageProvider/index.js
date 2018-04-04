/*
 *
 * LanguageProvider
 *
 * this component connects the redux state language locale to the
 * IntlProvider component and i18n messages (loaded from `app/translations`)
 */

import React, { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, IntlProvider } from 'react-intl';
import { compose, withContext } from 'recompose';
import { createStructuredSelector } from 'reselect';
import defaultMessages from 'ra-language-english';

import { selectLocale, selectMessages } from './selectors';

/* eslint-disable no-restricted-syntax, no-continue */
export const fromPolyglot = obj => {
  const toReturn = {};
  for (const i in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    if (typeof obj[i] === 'object') {
      const flatObject = fromPolyglot(obj[i]);
      for (const x in flatObject) {
        if (!Object.prototype.hasOwnProperty.call(flatObject, x)) continue;
        toReturn[`${i}.${x}`] = flatObject[x];
      }
    } else {
      toReturn[i] = obj[i];
    }
  }
  return toReturn;
};

const TranslationProvider = props => Children.only(props.children);

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
  TranslationProvider
);

// eslint-disable-next-line react/prefer-stateless-function
export class LanguageProvider extends PureComponent {
  render() {
    return (
      <IntlProvider
        locale={this.props.locale}
        key={this.props.locale}
        messages={
          fromPolyglot(this.props.messages) || fromPolyglot(defaultMessages)
        }
      >
        <ConnectedTranslationProvider>
          {this.props.children}
        </ConnectedTranslationProvider>
      </IntlProvider>
    );
  }
}

LanguageProvider.defaultProps = {
  locale: 'en',
};

LanguageProvider.propTypes = {
  locale: PropTypes.string,
  messages: PropTypes.object,
  children: PropTypes.element.isRequired,
};

const mapStateToProps = createStructuredSelector({
  locale: selectLocale,
  messages: selectMessages,
});

const withI18nContext2 = withContext(
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

export default compose(connect(mapStateToProps), withI18nContext2)(
  LanguageProvider
);
