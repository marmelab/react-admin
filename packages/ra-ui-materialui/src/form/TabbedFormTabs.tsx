import * as React from 'react';
import { Children, cloneElement, isValidElement, ReactElement } from 'react';
import PropTypes from 'prop-types';
import Tabs, { TabsProps } from '@mui/material/Tabs';
import { useParams } from 'react-router-dom';

export const TabbedFormTabs = (props: TabbedFormTabsProps) => {
    const { children, classes, url, syncWithLocation, value, ...rest } = props;

    const params = useParams();

    // params will include eventual parameters from the root pathname and * for the remaining part
    // which should match the tabs paths
    const tabValue = params['*'];

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
                const tabPath = getTabbedFormTabFullPath(tab, index);

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

export const getTabbedFormTabFullPath = (
    tab: ReactElement,
    index: number
): string =>
    `${tab.props.path ? `/${tab.props.path}` : index > 0 ? index : ''}`;

export interface TabbedFormTabsProps extends TabsProps {
    classes?: any;
    url?: string;
    tabsWithErrors?: string[];
    syncWithLocation?: boolean;
}
