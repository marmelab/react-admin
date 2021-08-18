import * as React from 'react';
import { Children, cloneElement, isValidElement, ReactElement } from 'react';
import PropTypes from 'prop-types';
import Tabs, { TabsProps } from '@material-ui/core/Tabs';
import { useLocation } from 'react-router-dom';

const TabbedFormTabs = (props: TabbedFormTabsProps) => {
    const { children, classes, url, syncWithLocation, value, ...rest } = props;
    const location = useLocation();

    const validTabPaths = Children.map(children, (tab, index) => {
        if (!isValidElement(tab)) return undefined;
        return getTabFullPath(tab, index, url);
    });

    // This ensures we don't get warnings from material-ui Tabs component when
    // the current location pathname targets a dynamically added Tab
    // In the case the targeted Tab is not present at first render (when
    // using permissions for example) we temporarily switch to the first
    // available tab. The current location will be applied again on the
    // first render containing the targeted tab. This is almost transparent
    // for the user who may just see a short tab selection animation
    const tabValue = validTabPaths.includes(location.pathname)
        ? location.pathname
        : validTabPaths[0];

    return (
        <Tabs
            value={syncWithLocation ? tabValue : value}
            indicatorColor="primary"
            {...rest}
        >
            {Children.map(children, (tab: ReactElement, index) => {
                if (!isValidElement<any>(tab)) return null;

                // Builds the full tab which is the concatenation of the last matched route in the
                // TabbedShowLayout hierarchy (ex: '/posts/create', '/posts/12', , '/posts/12/show')
                // and the tab path.
                // This will be used as the Tab's value
                const tabPath = getTabFullPath(tab, index, url);

                return cloneElement(tab, {
                    intent: 'header',
                    value: syncWithLocation ? tabPath : index,
                    classes,
                    syncWithLocation,
                });
            })}
        </Tabs>
    );
};

TabbedFormTabs.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    url: PropTypes.string,
    tabsWithErrors: PropTypes.arrayOf(PropTypes.string),
};

export const getTabFullPath = (
    tab: ReactElement,
    index: number,
    baseUrl: string
): string =>
    `${baseUrl}${
        tab.props.path ? `/${tab.props.path}` : index > 0 ? `/${index}` : ''
    }`.replace('//', '/'); // Because baseUrl can be a single / when on the first tab

export interface TabbedFormTabsProps extends TabsProps {
    classes?: any;
    url?: string;
    tabsWithErrors?: string[];
    syncWithLocation?: boolean;
}

export default TabbedFormTabs;
