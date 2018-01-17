import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import BaseFactory from './BaseFactory';
import TabbedFormLayout from './TabbedFormLayout';
import Tabs, { Tab } from 'material-ui/Tabs';
import Toolbar from './Toolbar';

class TabbedFormLayoutFactory extends React.Component {
    static propTypes = {
        handleSubmitWithRedirect: PropTypes.func,
        toolbar: PropTypes.element,
        invalid: PropTypes.bool,
        submitOnEnter: PropTypes.bool,
    };
    static defaultProps = {
        render: TabbedFormLayout,
        submitOnEnter: true,
        toolbar: <Toolbar />,
        value: 0,
    };

    componentWillMount() {
        this.factories = {
            activeTab: this.createActiveTab,
            toolbar: this.createToolbar,
            tabs: this.createTabs,
            tab: this.createTab,
        };
    }

    childIdentifier = component => component.label;

    childRenderer = (component, { basePath, record, resource }) =>
        React.cloneElement(component, { basePath, record, resource });

    createTab = ({ label, icon, index }) => {
        const { classes, translate, value, tabsWithErrors } = this.props;
        return (
            <Tab
                key={label}
                label={translate(label, {
                    _: label,
                })}
                value={index}
                icon={icon}
                className={classnames(
                    'form-tab',
                    tabsWithErrors.includes(label) && value !== index
                        ? classes.errorTabButton
                        : null
                )}
            />
        );
    };

    createTabs = props => {
        const { value, handleChange, children } = this.props;
        return (
            <Tabs scrollable value={value} onChange={handleChange} {...props}>
                {React.Children.map(
                    children,
                    (child, index) =>
                        child
                            ? this.createTab({
                                  label: child.props.label,
                                  icon: child.props.icon,
                                  index,
                              })
                            : null
                )}
            </Tabs>
        );
    };

    createActiveTab = props => {
        const { children, value, ...rest } = this.props;
        const tab = React.Children
            .toArray(children)
            .find((child, index) => value === index);
        return tab ? this.childRenderer(tab, { ...props, ...rest }) : null;
    };

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
                factories={this.factories}
                childIdentifier={this.childIdentifier}
                childRenderer={this.childRenderer}
                {...this.props}
            />
        );
    }
}
export default TabbedFormLayoutFactory;
