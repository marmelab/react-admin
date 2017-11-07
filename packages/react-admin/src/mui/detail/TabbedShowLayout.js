import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Tabs, { Tab } from 'material-ui/Tabs';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';

import getDefaultValues from '../form/getDefaultValues';

const styles = { tab: { padding: '0 1em 1em 1em' } };

export class TabbedShowLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
        };
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        const {
            children,
            classes,
            record,
            resource,
            basePath,
            translate,
        } = this.props;
        return (
            <div>
                <Tabs value={this.state.value} onChange={this.handleChange}>
                    {Children.map(
                        children,
                        (tab, index) =>
                            tab ? (
                                <Tab
                                    key={tab.props.label}
                                    label={translate(tab.props.label, {
                                        _: tab.props.label,
                                    })}
                                    value={index}
                                    icon={tab.props.icon}
                                    className="show-tab"
                                />
                            ) : null
                    )}
                </Tabs>
                <Divider />
                <div className={classes.tab}>
                    {Children.map(
                        children,
                        (tab, index) =>
                            tab &&
                            this.state.value === index &&
                            React.cloneElement(tab, {
                                resource,
                                record,
                                basePath,
                            })
                    )}
                </div>
            </div>
        );
    }
}

TabbedShowLayout.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
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
    })),
    withStyles(styles)
);

export default enhance(TabbedShowLayout);
