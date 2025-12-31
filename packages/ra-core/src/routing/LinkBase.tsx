import * as React from 'react';
import { forwardRef } from 'react';
import { useRouterProvider } from './RouterProviderContext';
import type { RouterLinkProps } from './RouterProvider';

export type { RouterLinkProps as LinkBaseProps } from './RouterProvider';

/**
 * Base Link component for use with react-admin's routing.
 * This is a router-agnostic wrapper that uses the configured router provider.
 *
 * For most use cases, prefer the styled `Link` component from `ra-ui-materialui`.
 *
 * @example
 * import { LinkBase } from 'ra-core';
 *
 * const MyComponent = () => (
 *     <LinkBase to="/posts/1">Post 1</LinkBase>
 * );
 */
export const LinkBase = forwardRef<HTMLAnchorElement, RouterLinkProps>(
    (props, ref) => {
        const provider = useRouterProvider();
        return <provider.Link ref={ref} {...props} />;
    }
);

LinkBase.displayName = 'LinkBase';
