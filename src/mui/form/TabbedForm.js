import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Tabs, Tab } from 'material-ui/Tabs';
import Toolbar from './Toolbar';
import getDefaultValues from './getDefaultValues';

const formStyle = { padding: '0 1em 1em 1em' };

export class TabbedForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
        };
    }

    handleChange = (value) => {
        this.setState({ value });
    };

    handleSubmitWithRedirect = redirect => this.props.handleSubmit(values => this.props.save(values, redirect));

    render() {
        const { children, contentContainerStyle, invalid, record, resource, basePath, translate, submitOnEnter, toolbar, redirect } = this.props;
        return (
            <form className="tabbed-form">
                <div style={formStyle}>
                    <Tabs
                        value={this.state.value}
                        onChange={this.handleChange}
                        contentContainerStyle={contentContainerStyle}
                    >
                        {React.Children.map(children, (tab, index) =>
                            <Tab
                                key={tab.props.value}
                                className="form-tab"
                                label={translate(tab.props.label, { _: tab.props.label })}
                                value={index}
                                icon={tab.props.icon}
                            >
                                {React.cloneElement(tab, { resource, record, basePath })}
                            </Tab>,
                        )}
                    </Tabs>
                </div>
                {toolbar && React.cloneElement(toolbar, {
                    handleSubmitWithRedirect: this.handleSubmitWithRedirect,
                    invalid,
                    redirect,
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
    defaultValue: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
    ]),
    handleSubmit: PropTypes.func, // passed by redux-form
    invalid: PropTypes.bool,
    record: PropTypes.object,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]),
    resource: PropTypes.string,
    save: PropTypes.func, // the handler defined in the parent, which triggers the REST submission
    submitOnEnter: PropTypes.bool,
    toolbar: PropTypes.element,
    translate: PropTypes.func,
    validate: PropTypes.func,
};

TabbedForm.defaultProps = {
    contentContainerStyle: { borderTop: 'solid 1px #e0e0e0' },
    submitOnEnter: true,
    toolbar: <Toolbar />,
};

const enhance = compose(
    connect((state, props) => ({
        initialValues: getDefaultValues(state, props),
    })),
    reduxForm({
        form: 'record-form',
        enableReinitialize: true,
    }),
);

export default enhance(TabbedForm);
