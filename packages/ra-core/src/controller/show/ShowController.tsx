import {
    useShowController,
    ShowControllerProps,
    ShowControllerResult,
} from './useShowController';

/**
 * Render prop version of the useShowController hook
 *
 * @see useShowController
 * @example
 *
 * const ShowView = () => <div>...</div>
 * const MyShow = () => (
 *     <ShowController>
 *         {controllerProps => <ShowView {...controllerProps} {...props} />}
 *     </ShowController>
 * );
 */
export const ShowController = ({
    children,
    ...props
}: {
    children: (params: ShowControllerResult) => JSX.Element;
} & ShowControllerProps) => {
    const controllerProps = useShowController(props);
    return children(controllerProps);
};
