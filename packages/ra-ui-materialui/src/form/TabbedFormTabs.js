import React, { Children, cloneElement, isValidElement } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';

const getTabFullPath = (tab, index, baseUrl) =>
    `${baseUrl}${
        tab.props.path ? `/${tab.props.path}` : index > 0 ? `/${index}` : ''
    }`;

const TabbedFormTabs = ({ children, classes, currentLocationPath, match, tabsWithErrors, ...rest }) => {

    const validTabPaths = Children.toArray(children).map((tab, index) =>
        getTabFullPath(tab, index, match.url)
    );

    // This ensure we don't get warnings from material-ui Tabs component when
    // the current location pathname targets a dynamically added Tab
    // In the case the targeted Tab is not present at first render (when
    // using permissions for example) we temporarily switch to the first
    // available tab. The current location will be applied again on the
    // first render containing the targeted tab. This is almost transparent
    // for the user who may just see an short tab selection animation
    const tabValue = validTabPaths.includes(currentLocationPath)
        ? currentLocationPath
        : validTabPaths[0];

    return (
        <Tabs value={tabValue} indicatorColor="primary" {...rest} >
            {Children.map(children, (tab, index) => {
                if (!isValidElement(tab)) return null;

                // Builds the full tab tab which is the concatenation of the last matched route in the
                // TabbedShowLayout hierarchy (ex: '/posts/create', '/posts/12', , '/posts/12/show')
                // and the tab path.
                // This will be used as the Tab's value
                const tabPath = getTabFullPath(tab, index, match.url);

                return cloneElement(tab, {
                    context: 'header',
                    value: tabPath,
                    className:
                        tabsWithErrors.includes(tab.props.label) &&
                            currentLocationPath !== tabPath
                            ? classes.errorTabButton
                            : null,
                });
            })}
        </Tabs>
    );
};

TabbedFormTabs.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    currentLocationPath: PropTypes.string,
    match: PropTypes.object,
    tabsWithErrors: PropTypes.arrayOf(PropTypes.string),
};

export default TabbedFormTabs;