import * as React from 'react';
import { ReactElement } from 'react';
import {
    useNotify,
    UseCheckForApplicationUpdateOptions,
    useCheckForApplicationUpdate,
} from 'ra-core';
import { ApplicationUpdatedNotification } from './ApplicationUpdatedNotification';

/**
 * Display a notification asking users to reload the page when the application code has changed.
 *
 * @param {CheckForApplicationUpdateProps} props
 * @param {boolean} options.disabled Optional. Whether the check should be disabled. Defaults to false.
 * @param {string|ReactElement} props.notification The notification to display to the user. Displayed only if `updateMode` is manual. Defaults to `<ApplicationUpdatedNotification />`.
 * @param {string} options.url Optional. The URL to download to check for code update. Defaults to the current URL.
 * @param {RequestInit} options.fetchOptions Optional. The options passed to fetch function when checking for update.
 * @param {number} options.interval Optional. The interval in milliseconds between two checks. Defaults to 3600000 (1 hour).
 *
 * @example <caption>Basic usage</caption>
 * import { Admin, Resource, Layout, CheckForApplicationUpdate, ListGuesser } from 'react-admin';
 *
 * const MyLayout = ({ children }) => (
 *   <Layout>
 *     {children}
 *     <CheckForApplicationUpdate />
 *   </Layout>
 * );
 *
 * const App = () => (
 *   <Admin layout={MyLayout}>
 *      <Resource name="posts" list={ListGuesser} />
 *   </Admin>
 * );
 *
 * @example <caption>Custom notification</caption>
 * import { forwardRef } from 'react';
 * import { Admin, Resource, Layout, CheckForApplicationUpdate, ListGuesser } from 'react-admin';
 *
 * const CustomAppUpdatedNotification = forwardRef((props, ref) => (
 *   <Alert
 *     ref={ref}
 *     severity="info"
 *     action={
 *       <Button
 *         color="inherit"
 *         size="small"
 *         onClick={() => window.location.reload()}
 *       >
 *         Update
 *       </Button>
 *     }
 *   >
 *     A new version of the application is available. Please update.
 *   </Alert>
 * ));
 *
 * const MyLayout = ({ children }) => (
 *   <Layout>
 *     {children}
 *     <CheckForApplicationUpdate notification={<CustomAppUpdatedNotification />} />
 *   </Layout>
 * );
 *
 * const App = () => (
 *   <Admin layout={MyLayout}>
 *      <Resource name="posts" list={ListGuesser} />
 *   </Admin>
 * );
 */
export const CheckForApplicationUpdate = (
    props: CheckForApplicationUpdateProps
) => {
    const { notification = DEFAULT_NOTIFICATION, ...rest } = props;
    const notify = useNotify();

    const onNewVersionAvailable = () => {
        notify(notification, {
            type: 'info',
            autoHideDuration: null,
        });
    };

    useCheckForApplicationUpdate({ onNewVersionAvailable, ...rest });
    return null;
};

export interface CheckForApplicationUpdateProps
    extends Omit<UseCheckForApplicationUpdateOptions, 'onNewVersionAvailable'> {
    onNewVersionAvailable?: UseCheckForApplicationUpdateOptions['onNewVersionAvailable'];
    notification?: ReactElement;
}

const DEFAULT_NOTIFICATION = <ApplicationUpdatedNotification />;
