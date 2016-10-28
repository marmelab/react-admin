import { PropTypes, Component } from 'react';

// This component is used internaly only.
// It is used by <Export /> to pass currentContext to ReactDOMServer.renderToStaticMarkup
export default class FieldContext extends Component {
    static propTypes = {
        children: PropTypes.element,
        muiTheme: PropTypes.object,
        store: PropTypes.object,
    };

    static childContextTypes = {
        muiTheme: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired,
    };

    getChildContext() {
        return {
            store: this.props.store,
            muiTheme: this.props.muiTheme,
        };
    }

    render() {
        return this.props.children;
    }
}
