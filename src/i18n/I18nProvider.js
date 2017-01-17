import Polyglot from 'node-polyglot';
import { Component, Children, PropTypes } from 'react';

class I18nProvider extends Component {
    getChildContext() {
        const {
            locale,
            messages,
        } = this.props;

        const polyglot = new Polyglot({ locale, phrases: messages });

        return {
            locale,
            translate: polyglot.t.bind(polyglot),
        };
    }

    render() {
        return Children.only(this.props.children);
    }
}

I18nProvider.propTypes = {
    locale: PropTypes.string.isRequired,
    messages: PropTypes.object,
    children: PropTypes.element,
};

I18nProvider.childContextTypes = {
    locale: PropTypes.string.isRequired,
    translate: PropTypes.func.isRequired,
};

export default I18nProvider;
