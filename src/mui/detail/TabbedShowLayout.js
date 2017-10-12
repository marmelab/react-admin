import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'material-ui/Tabs';

const divStyle = { padding: '0 1em 1em 1em' };
class TabbedShowLayout extends Component {
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
            version,
        } = this.props;
        return (
            <div style={divStyle} key={version}>
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
    version: PropTypes.number,
};

TabbedShowLayout.defaultProps = {
    contentContainerStyle: { borderTop: 'solid 1px #e0e0e0' },
};

export default TabbedShowLayout;
