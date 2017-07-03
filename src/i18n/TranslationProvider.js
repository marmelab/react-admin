import { Children } from 'react';
import PropTypes from 'prop-types';
import Polyglot from 'node-polyglot';
import { connect } from 'react-redux';
import { compose, withContext } from 'recompose';

import defaultMessages from './messages';

const withI18nContext = withContext(
    {
        translate: PropTypes.func.isRequired,
        locale: PropTypes.string.isRequired,
    },
    ({ locale, messages = {} }) => {
        const userMessages = messages[locale] || {};
        const polyglot = new Polyglot({
            locale,
            phrases: { ...defaultMessages, ...userMessages },
        });

        return {
            locale,
            translate: polyglot.t.bind(polyglot),
        };
    }
);

const TranslationProvider = ({ children }) => Children.only(children);

TranslationProvider.propTypes = {
    locale: PropTypes.string.isRequired,
    messages: PropTypes.object,
    children: PropTypes.element,
};

const mapStateToProps = state => ({ locale: state.locale });

export default compose(connect(mapStateToProps), withI18nContext)(
    TranslationProvider
);
