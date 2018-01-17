import React from 'react';
import PropTypes from 'prop-types';

/**
 *
 */
class ChildFactory extends React.Component {
    static propTypes = {
        factories: PropTypes.object,
        render: PropTypes.func.isRequired,
        children: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.arrayOf(PropTypes.element),
        ]).isRequired,
        transform: PropTypes.func,
        childIdentifier: PropTypes.func.isRequired,
        childRenderer: PropTypes.func,
        childrenFactoryProp: PropTypes.string,
        childFactoryProp: PropTypes.string,
    };

    static defaultProps = {
        childrenFactoryProp: 'children',
        childFactoryProp: 'child',
        childRenderer: React.cloneElement,
    };

    componentWillMount() {
        this.indexComponentsByIdentifier(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.indexComponentsByIdentifier(nextProps);
    }
    indexComponentsByIdentifier(nextProps) {
        this.childrenByIdentifier = React.Children
            .toArray(nextProps.children)
            .reduce((acc, child) => {
                const identifier = nextProps.childIdentifier(child);
                if (identifier) {
                    acc[identifier] = child;
                }
                return acc;
            }, {});
    }

    createChild = (identifier, props) => {
        const { childRenderer, children, ...rest } = this.props;
        const childElement =
            typeof identifier === 'string'
                ? this.childrenByIdentifier[identifier]
                : identifier;

        return childElement
            ? childRenderer(childElement, {
                  ...rest,
                  ...props,
              })
            : null;
    };

    createChildren = props => {
        const { children } = this.props;
        return React.Children.map(children, child =>
            this.createChild(child, props)
        );
    };

    render() {
        const {
            factories,
            children,
            childFactoryProp,
            childrenFactoryProp,
            render,
            ...props
        } = this.props;

        return render(
            {
                ...factories,
                [childrenFactoryProp]: this.createChildren,
                [childFactoryProp]: this.createChild,
            },
            props
        );
    }
}
export default ChildFactory;
