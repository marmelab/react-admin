import React, { Children, Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Tabs, Tab } from 'material-ui/Tabs';
import { getFieldConstraints, getErrorsForForm, getErrorsForFieldConstraints } from '../../util/validate';
import Toolbar from './Toolbar';
import getDefaultValues from '../form/getDefaultValues';
import translate from '../../i18n/translate';

/**
 * Validator function for redux-form
 */
export const validateForm = (values, { children, validation }) => {
    // digging first in `<FormTab>`, then in all children
    const fieldConstraints = Children.toArray(children)
        .map(child => child.props.children)
        .map(getFieldConstraints)
        // merge all constraints object into a single object
        .reduce((prev, next) => ({ ...prev, ...next }), {});

    return {
        ...getErrorsForForm(validation, values),
        ...getErrorsForFieldConstraints(fieldConstraints, values),
    };
};

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
        const { children, contentContainerStyle, handleSubmit, invalid, record, resource, basePath, translate } = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <div style={{ padding: '0 1em 1em 1em' }}>
                    <Tabs value={this.state.value} onChange={this.handleChange} contentContainerStyle={contentContainerStyle}>
                        {React.Children.map(children, (tab, index) =>
                            <Tab key={tab.props.value} label={translate(tab.props.label)} value={index} icon={tab.props.icon}>
                                {React.cloneElement(tab, { resource, record, basePath })}
                            </Tab>
                        )}
                    </Tabs>
                </div>
                <Toolbar invalid={invalid} />
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
    validation: PropTypes.func,
};

TabbedForm.defaultProps = {
    contentContainerStyle: { borderTop: 'solid 1px #e0e0e0' },
};

const enhance = compose(
    connect((state, props) => ({
        initialValues: getDefaultValues(state, props),
    })),
    reduxForm({
        form: 'record-form',
        validate: validateForm,
        enableReinitialize: true,
    }),
    translate,
);

export default enhance(TabbedForm);
