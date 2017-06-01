import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Tabs, Tab } from 'material-ui/Tabs';
import Toolbar from './Toolbar';
import getDefaultValues from './getDefaultValues';
import translate from '../../i18n/translate';

const noop = () => {};

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

    render() {
        const { children, contentContainerStyle, handleSubmit, invalid, record, resource, basePath, translate, submitOnEnter } = this.props;
        return (
            <form onSubmit={ submitOnEnter ? handleSubmit : noop } className="tabbed-form">
                <div style={{ padding: '0 1em 1em 1em' }}>
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
                            </Tab>
                        )}
                    </Tabs>
                </div>
                <Toolbar invalid={invalid} submitOnEnter={submitOnEnter} />
            </form>
        );
    }
}

TabbedForm.propTypes = {
    children: PropTypes.node,
    contentContainerStyle: PropTypes.object,
    defaultValue: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
    ]),
    handleSubmit: PropTypes.func,
    invalid: PropTypes.bool,
    record: PropTypes.object,
    resource: PropTypes.string,
    basePath: PropTypes.string,
    translate: PropTypes.func,
    validate: PropTypes.func,
    submitOnEnter: PropTypes.bool,
};

TabbedForm.defaultProps = {
    contentContainerStyle: { borderTop: 'solid 1px #e0e0e0' },
    submitOnEnter: true,
};

const enhance = compose(
    connect((state, props) => ({
        initialValues: getDefaultValues(state, props),
    })),
    reduxForm({
        form: 'record-form',
        enableReinitialize: true,
    }),
    translate,
);

export default enhance(TabbedForm);
