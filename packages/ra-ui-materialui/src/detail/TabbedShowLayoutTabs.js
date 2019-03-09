import React, { Children, cloneElement, isValidElement } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';

const getTabFullPath = (tab, index, baseUrl) =>
    `${baseUrl}${
        tab.props.path ? `/${tab.props.path}` : index > 0 ? `/${index}` : ''
    }`;

const TabbedShowLayoutTabs = ({ children, match, ...rest }) => (
    <Tabs indicatorColor="primary" {...rest}>
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

TabbedShowLayoutTabs.propTypes = {
    children: PropTypes.node,
    match: PropTypes.object,
    value: PropTypes.string,
};

export default TabbedShowLayoutTabs;
