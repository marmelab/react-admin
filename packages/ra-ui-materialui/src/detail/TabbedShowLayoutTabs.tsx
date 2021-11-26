import * as React from 'react';
import { Children, cloneElement, ReactElement, isValidElement } from 'react';
import PropTypes from 'prop-types';
import Tabs, { TabsProps } from '@mui/material/Tabs';
import { useParams } from 'react-router-dom';
import { TabProps } from './Tab';

export const TabbedShowLayoutTabs = ({
    children,
    syncWithLocation,
    value,
    ...rest
}: TabbedShowLayoutTabsProps) => {
    const params = useParams();

    // params will include eventual parameters from the root pathname and * for the remaining part
    // which should match the tabs paths
    const tabValue = params['*'];

    return (
        <Tabs
            indicatorColor="primary"
            value={syncWithLocation ? tabValue : value}
            {...rest}
        >
            {Children.map(children, (tab, index) => {
                if (!tab || !isValidElement(tab)) return null;
                // Builds the full tab which is the concatenation of the last matched route in the
                // TabbedShowLayout hierarchy (ex: '/posts/create', '/posts/12', , '/posts/12/show')
                // and the tab path.
                // This will be used as the Tab's value
                const tabPath = getShowLayoutTabFullPath(tab, index);

                return cloneElement(tab, {
                    context: 'header',
                    value: syncWithLocation ? tabPath : index,
                    syncWithLocation,
                });
            })}
        </Tabs>
    );
};

export const getShowLayoutTabFullPath = (tab, index) =>
    `${tab.props.path ? `${tab.props.path}` : index > 0 ? index : ''}`;

export interface TabbedShowLayoutTabsProps extends TabsProps {
    children?: ReactElement<TabProps>;
    syncWithLocation?: boolean;
}

TabbedShowLayoutTabs.propTypes = {
    children: PropTypes.node,
};
