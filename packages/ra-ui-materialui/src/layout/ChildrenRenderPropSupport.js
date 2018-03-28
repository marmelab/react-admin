import React from 'react';
import PropTypes from 'prop-types';
import shallowEqual from 'recompose/shallowEqual';
import pick from 'lodash/pick';

class ChildrenRenderPropSupport extends React.Component {
    static propTypes = {
        children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        memoizeProps: PropTypes.arrayOf(PropTypes.string),
        render: PropTypes.func,
    };
    state = {
        children: null,
    };

    componentWillMount() {
        this.setupChildren(this.props);
    }
    componentWillReceiveProps({ memoizeProps, ...nextProps }) {
        if (
            typeof children === 'function' &&
            (!memoizeProps ||
                !shallowEqual(
                    pick(this.props, memoizeProps),
                    pick(nextProps, memoizeProps)
                ))
        ) {
            this.setupChildren(nextProps);
        }
    }

    setupChildren = ({ children, ...props }) => {
        this.setState({
            children:
                typeof children === 'function'
                    ? children(props).filter(c => c)
                    : children,
        });
    };
    render() {
        const { children, render, memoizeProps, ...props } = this.props;
        return render({
            ...props,
            children:
                typeof children === 'function' ? this.state.children : children,
        });
    }
}
export default ChildrenRenderPropSupport;
