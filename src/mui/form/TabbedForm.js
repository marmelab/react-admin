import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { validateForm } from '../../util/validate';
import { SaveButton } from '../button';

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
        const { children, contentContainerStyle, handleSubmit, record, resource, basePath } = this.props;
        const commonProps = { resource, record, basePath };
        return (
            <form onSubmit={handleSubmit}>
                <div style={{ padding: '0 1em 1em 1em' }}>
                    <Tabs value={this.state.value} onChange={this.handleChange} contentContainerStyle={contentContainerStyle}>
                        {React.Children.map(children, (tab, index) =>
                            <Tab key={tab.props.value} label={tab.props.label} value={index} icon={tab.props.icon}>
                                {React.cloneElement(tab, commonProps)}
                            </Tab>
                        )}
                    </Tabs>
                </div>
                <Toolbar>
                    <ToolbarGroup>
                        <SaveButton />
                    </ToolbarGroup>
                </Toolbar>
            </form>
        );
    }
}

TabbedForm.propTypes = {
    children: PropTypes.node,
    contentContainerStyle: PropTypes.object,
    handleSubmit: PropTypes.func,
    record: PropTypes.object,
    resource: PropTypes.string,
    basePath: PropTypes.string,
    validation: PropTypes.func,
};
TabbedForm.defaultProps = {
    contentContainerStyle: { borderTop: 'solid 1px #e0e0e0' },
};

export default reduxForm({
    form: 'record-form',
    validate: validateForm,
})(TabbedForm);
