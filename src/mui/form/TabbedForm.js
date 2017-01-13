import React, { Children, Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { validateForm } from '../../util/validate';
import { SaveButton } from '../button';
import getDefaultValues from '../form/getDefaultValues';

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
        const { children, contentContainerStyle, handleSubmit, invalid, record, resource, basePath } = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <div style={{ padding: '0 1em 1em 1em' }}>
                    <Tabs value={this.state.value} onChange={this.handleChange} contentContainerStyle={contentContainerStyle}>
                        {React.Children.map(children, (tab, index) =>
                            <Tab key={tab.props.value} label={tab.props.label} value={index} icon={tab.props.icon}>
                                {React.cloneElement(tab, { resource, record, basePath })}
                            </Tab>
                        )}
                    </Tabs>
                </div>
                <Toolbar>
                    <ToolbarGroup>
                        <SaveButton invalid={invalid} />
                    </ToolbarGroup>
                </Toolbar>
            </form>
        );
    }
}

TabbedForm.propTypes = {
    children: PropTypes.node,
    contentContainerStyle: PropTypes.object,
    defaultValue: PropTypes.object,
    handleSubmit: PropTypes.func,
    invalid: PropTypes.bool,
    record: PropTypes.object,
    resource: PropTypes.string,
    basePath: PropTypes.string,
    validation: PropTypes.func,
};
TabbedForm.defaultProps = {
    contentContainerStyle: { borderTop: 'solid 1px #e0e0e0' },
};

const ReduxForm = reduxForm({
    form: 'record-form',
    validate: validateForm,
})(TabbedForm);

const mapStateToProps = (state, props) => ({
    initialValues: getDefaultValues(Children.toArray(props.children))(props.record, props.defaultValue),
});

export default connect(mapStateToProps)(ReduxForm);
