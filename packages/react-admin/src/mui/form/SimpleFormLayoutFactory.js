import React from 'react';
import PropTypes from 'prop-types';
import BaseFactory from './BaseFactory';
import SimpleFormLayout from './SimpleFormLayout';
import FormInput from './FormInput';
import Toolbar from './Toolbar';

class SimpleFormLayoutFactory extends React.Component {
    static propTypes = {
        handleSubmitWithRedirect: PropTypes.func,
        toolbar: PropTypes.element,
        invalid: PropTypes.bool,
        submitOnEnter: PropTypes.bool,
    };
    static defaultProps = {
        render: SimpleFormLayout,
        submitOnEnter: true,
        toolbar: <Toolbar />,
    };

    componentWillMount() {
        this.factories = {
            toolbar: this.createToolbar,
        };
    }

    childIdentifier = component => component.reference || component.source;

    childRenderer = (component, { basePath, record, resource }) => (
        <FormInput
            input={component}
            resource={resource}
            basePath={basePath}
            record={record}
        />
    );

    createToolbar = props => {
        const {
            toolbar,
            handleSubmitWithRedirect,
            invalid,
            submitOnEnter,
        } = this.props;
        return toolbar
            ? React.cloneElement(toolbar, {
                  handleSubmitWithRedirect,
                  invalid,
                  submitOnEnter,
                  ...props,
              })
            : null;
    };

    render() {
        return (
            <BaseFactory
                defaultLayout={SimpleFormLayout}
                factories={this.factories}
                childIdentifier={this.childIdentifier}
                childFactoryProp="field"
                childrenFactoryProp="fields"
                childRenderer={this.childRenderer}
                {...this.props}
            />
        );
    }
}
export default SimpleFormLayoutFactory;
