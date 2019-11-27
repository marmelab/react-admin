import React, { Children, cloneElement, isValidElement } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import { useLocation, useRouteMatch } from 'react-router-dom';

export const getTabFullPath = (tab, index, baseUrl) =>
    `${baseUrl}${
        tab.props.path ? `/${tab.props.path}` : index > 0 ? `/${index}` : ''
    }`;

const TabbedShowLayoutTabs = ({ children, ...rest }) => {
    const location = useLocation();
    const match = useRouteMatch();

    // The location pathname will contain the page path including the current tab path
    // so we can use it as a way to determine the current tab
    const value = location.pathname;

    return (
        <Tabs indicatorColor="primary" value={value} {...rest}>
            {Children.map(children, (tab, index) => {
                if (!tab || !isValidElement(tab)) return null;
                // Builds the full tab tab which is the concatenation of the last matched route in the
                // TabbedShowLayout hierarchy (ex: '/posts/create', '/posts/12', , '/posts/12/show')
                // and the tab path.
                // This will be used as the Tab's value
                const tabPath = getTabFullPath(tab, index, match.url);

                return cloneElement(tab, {
                    context: 'header',
                    value: tabPath,
                });
            })}
        </Tabs>
    );
};

TabbedShowLayoutTabs.propTypes = {
    children: PropTypes.node,
};

export default TabbedShowLayoutTabs;
