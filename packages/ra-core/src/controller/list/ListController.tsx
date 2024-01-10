import {
    useListController,
    ListControllerProps,
    ListControllerResult,
} from './useListController';

/**
 * Render prop version of the useListController hook.
 *
 * @see useListController
 * @example
 *
 * const ListView = () => <div>...</div>;
 * const List = props => (
 *     <ListController {...props}>
 *        {controllerProps => <ListView {...controllerProps} {...props} />}
 *     </ListController>
 * )
 */
export const ListController = ({
    children,
    ...props
}: {
    children: (params: ListControllerResult) => JSX.Element;
} & ListControllerProps) => {
    const controllerProps = useListController(props);
    return children(controllerProps);
};
