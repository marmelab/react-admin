import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import {
    reduxForm,
    getFormAsyncErrors,
    getFormSyncErrors,
    getFormSubmitErrors,
} from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Tabs, Tab } from 'material-ui/Tabs';
import muiThemeable from 'material-ui/styles/muiThemeable';

import Toolbar from './Toolbar';
import getDefaultValues from './getDefaultValues';

const getStyles = theme => ({
    form: { padding: '0 1em 1em 1em' },
    // TODO: The color will be taken from another property in MUI 0.19 and later
    errorTabButton: { color: theme.textField.errorColor },
});

export class TabbedForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
        };
    }

    handleChange = value => {
        this.setState({ value });
    };

    handleSubmitWithRedirect = (redirect = this.props.redirect) =>
        this.props.handleSubmit(values => this.props.save(values, redirect));

    render() {
        const {
            basePath,
            children,
            contentContainerStyle,
            invalid,
            muiTheme,
            record,
            resource,
            submitOnEnter,
            tabsWithErrors,
            toolbar,
            translate,
        } = this.props;

        const styles = getStyles(muiTheme);

        return (
            <form className="tabbed-form">
                <div style={styles.form}>
                    <Tabs
                        value={this.state.value}
                        onChange={this.handleChange}
                        contentContainerStyle={contentContainerStyle}
                    >
                        {React.Children.map(
                            children,
                            (tab, index) =>
                                tab ? (
                                    <Tab
                                        key={tab.props.label}
                                        className="form-tab"
                                        label={translate(tab.props.label, {
                                            _: tab.props.label,
                                        })}
                                        value={index}
                                        icon={tab.props.icon}
                                        buttonStyle={
                                            tabsWithErrors.includes(
                                                tab.props.label
                                            ) && this.state.value !== index ? (
                                                styles.errorTabButton
                                            ) : null
                                        }
                                    >
                                        {React.cloneElement(tab, {
                                            resource,
                                            record,
                                            basePath,
                                        })}
                                    </Tab>
                                ) : null
                        )}
                    </Tabs>
                </div>
                {toolbar &&
                    React.cloneElement(toolbar, {
                        handleSubmitWithRedirect: this.handleSubmitWithRedirect,
                        invalid,
                        submitOnEnter,
                    })}
            </form>
        );
    }
}

TabbedForm.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    contentContainerStyle: PropTypes.object,
    defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    handleSubmit: PropTypes.func, // passed by redux-form
    invalid: PropTypes.bool,
    muiTheme: PropTypes.object.isRequired,
    record: PropTypes.object,
    redirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    resource: PropTypes.string,
    save: PropTypes.func, // the handler defined in the parent, which triggers the REST submission
    submitOnEnter: PropTypes.bool,
    tabsWithErrors: PropTypes.arrayOf(PropTypes.string),
    toolbar: PropTypes.element,
    translate: PropTypes.func,
    validate: PropTypes.func,
};

TabbedForm.defaultProps = {
    contentContainerStyle: { borderTop: 'solid 1px #e0e0e0' },
    submitOnEnter: true,
    toolbar: <Toolbar />,
};

const collectErrors = state => {
    const syncErrors = getFormSyncErrors('record-form')(state);
    const asyncErrors = getFormAsyncErrors('record-form')(state);
    const submitErrors = getFormSubmitErrors('record-form')(state);

    return {
        ...syncErrors,
        ...asyncErrors,
        ...submitErrors,
    };
};

export const findTabsWithErrors = (
    state,
    props,
    collectErrorsImpl = collectErrors
) => {
    const errors = collectErrorsImpl(state);

    return Children.toArray(props.children).reduce((acc, child) => {
        const inputs = Children.toArray(child.props.children);

        if (inputs.some(input => errors[input.props.source])) {
            return [...acc, child.props.label];
        }

        return acc;
    }, []);
};

const enhance = compose(
    connect((state, props) => {
        const children = Children.toArray(props.children).reduce(
            (acc, child) => [...acc, ...Children.toArray(child.props.children)],
            []
        );

        return {
            tabsWithErrors: findTabsWithErrors(state, props),
            initialValues: getDefaultValues(state, { ...props, children }),
        };
    }),
    reduxForm({
        form: 'record-form',
        enableReinitialize: true,
    }),
    muiThemeable()
);

export default enhance(TabbedForm);
