import { Component, createElement, ComponentType } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { initializeForm as initializeFormAction } from '../actions/formActions';
import { InputProps } from './types';

export interface DefaultValueProps extends InputProps {
    decoratedComponent: ComponentType<InputProps>;
    initializeForm: typeof initializeFormAction;
}

export class DefaultValueView extends Component<DefaultValueProps> {
    static propTypes = {
        decoratedComponent: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.func,
        ]),
        defaultValue: PropTypes.any,
        initializeForm: PropTypes.func.isRequired,
        input: PropTypes.object,
        source: PropTypes.string,
        validate: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
    };

    componentDidMount() {
        const { defaultValue, input, initializeForm, source } = this.props;
        if (typeof defaultValue === 'undefined' || input) {
            return;
        }
        initializeForm({
            [source]:
                typeof defaultValue === 'function'
                    ? defaultValue()
                    : defaultValue,
        });
    }

    componentDidUpdate(prevProps) {
        const { defaultValue, input, initializeForm, source } = this.props;
        if (typeof defaultValue === 'undefined' || input) {
            return;
        }

        if (defaultValue !== prevProps.defaultValue) {
            initializeForm({
                [source]:
                    typeof defaultValue === 'function'
                        ? defaultValue()
                        : defaultValue,
            });
        }
    }

    render() {
        const { initializeForm, decoratedComponent, ...props } = this.props;
        return createElement(decoratedComponent, props);
    }
}

const DefaultValue = (DecoratedComponent: ComponentType<InputProps>) =>
    connect(
        () => ({ decoratedComponent: DecoratedComponent }),
        { initializeForm: initializeFormAction }
    )(DefaultValueView);

export default DefaultValue;
