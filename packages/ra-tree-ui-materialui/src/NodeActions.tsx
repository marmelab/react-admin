import React, {
    cloneElement,
    Children,
    Component,
    isValidElement,
} from 'react';
import PropTypes from 'prop-types';

export class NodeActions extends Component {
    static propTypes = {
        basePath: PropTypes.string.isRequired,
        children: PropTypes.node,
        record: PropTypes.object.isRequired,
        resource: PropTypes.string.isRequired,
    };

    render() {
        const { children, ...props } = this.props;
        return (
            <>
                {Children.map(children, action =>
                    action && isValidElement(action)
                        ? cloneElement(action, props)
                        : null
                )}
            </>
        );
    }
}

export default NodeActions;
