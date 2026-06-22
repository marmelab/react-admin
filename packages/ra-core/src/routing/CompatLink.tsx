import * as React from 'react';
import { forwardRef } from 'react';
import {
    createPath,
    useHref,
    useLocation,
    useNavigate,
    useResolvedPath,
} from 'react-router';
import type { To } from 'react-router';
import type { RouterLinkProps } from './RouterProvider';

const isModifiedEvent = (event: React.MouseEvent) =>
    !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

const shouldProcessLinkClick = (event: React.MouseEvent, target?: string) =>
    event.button === 0 && // ignore everything but left clicks
    (!target || target === '_self') && // let the browser handle "target=_blank" etc.
    !isModifiedEvent(event); // ignore clicks with modifier keys

type CompatLinkProps = RouterLinkProps & {
    target?: string;
    relative?: 'route' | 'path';
    reloadDocument?: boolean;
    preventScrollReset?: boolean;
    viewTransition?: boolean;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

/**
 * Minimal `<Link>` reimplementation for react-router v6, where `Link` is not
 * exported from the `react-router` package (it lived only in `react-router-dom`).
 * Mirrors react-router's own `Link` using only primitives available on every
 * supported version (`useHref`, `useResolvedPath`, `useNavigate`, `createPath`).
 *
 * Used as the v6 fallback by the default react-router adapter, which prefers
 * react-router's native `Link` when it exists (v7/v8). v6 users can always override
 * this with the `react-router-dom`'s `<Link>` component.
 */
export const CompatLink = forwardRef<HTMLAnchorElement, CompatLinkProps>(
    function CompatLink(
        {
            children,
            onClick,
            relative,
            reloadDocument,
            replace,
            state,
            target,
            to,
            preventScrollReset,
            viewTransition,
            ...rest
        },
        ref
    ) {
        const href = useHref(to as To, { relative });
        const navigate = useNavigate();
        const location = useLocation();
        const path = useResolvedPath(to as To, { relative });

        const handleClick = (
            event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
        ) => {
            onClick?.(event);
            if (
                !event.defaultPrevented &&
                !reloadDocument &&
                shouldProcessLinkClick(event, target)
            ) {
                event.preventDefault();
                // If the URL hasn't changed, a regular <a> will do a replace
                // instead of a push, so we do the same here unless overridden.
                const replaceProp =
                    replace !== undefined
                        ? replace
                        : createPath(location) === createPath(path);
                navigate(to as To, {
                    replace: replaceProp,
                    state,
                    preventScrollReset,
                    relative,
                    viewTransition,
                });
            }
        };

        return (
            <a
                {...rest}
                href={href}
                onClick={handleClick}
                ref={ref}
                target={target}
            >
                {children}
            </a>
        );
    }
);
