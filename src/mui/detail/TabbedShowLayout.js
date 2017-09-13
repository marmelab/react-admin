import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Tabs, Tab } from 'material-ui/Tabs';
import getDefaultValues from '../form/getDefaultValues';

const divStyle = { padding: '0 1em 1em 1em' };
export class TabbedShowLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
        };
    }

    handleChange = value => {
        this.setState({ value });
    };

    render() {
        const {
            children,
            contentContainerStyle,
            record,
            resource,
            basePath,
            translate,
        } = this.props;
        return (
            <div style={divStyle}>
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
                                    key={tab.props.value}
                                    label={translate(tab.props.label, {
                                        _: tab.props.label,
                                    })}
                                    value={index}
                                    icon={tab.props.icon}
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
        );
    }
}

TabbedShowLayout.propTypes = {
    children: PropTypes.node,
    contentContainerStyle: PropTypes.object,
    record: PropTypes.object,
    resource: PropTypes.string,
    basePath: PropTypes.string,
    translate: PropTypes.func,
};

TabbedShowLayout.defaultProps = {
    contentContainerStyle: { borderTop: 'solid 1px #e0e0e0' },
};

const enhance = compose(
    connect((state, props) => ({
        initialValues: getDefaultValues(state, props),
    }))
);

export default enhance(TabbedShowLayout);
