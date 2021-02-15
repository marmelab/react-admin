import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

/**
 * Scroll the window to top when the target location contains the _scrollToTop state
 *
 * @see CoreAdminRouter where it's enabled by default
 *
 * @example // usage in buttons
 * import { Link } from 'react-router-dom';
 * import { Button } from '@material-ui/core';
 *
 * const FooButton = () => (
 *     <Button
 *         component={Link}
 *         to={{
 *             pathname: '/foo',
 *             state: { _scrollToTop: true },
 *         }}
 *     >
 *         Go to foo
 *     </Button>
 * );
 */
export const useScrollToTop = () => {
    const history = useHistory<{ _scrollToTop?: boolean }>();
    useEffect(
        () =>
            history.listen((location, action) => {
                if (
                    action !== 'POP' &&
                    location.state?._scrollToTop &&
                    typeof window != 'undefined'
                ) {
                    window.scrollTo(0, 0);
                }
            }),
        [history]
    );
};
