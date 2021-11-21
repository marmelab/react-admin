import {
    useEditController,
    EditControllerProps,
    EditControllerResult,
} from './useEditController';

/**
 * Render prop version of the useEditController hook
 *
 * @see useEditController
 * @example
 *
 * const EditView = () => <div>...</div>
 * const MyEdit = props => (
 *     <EditController {...props}>
 *         {controllerProps => <EditView {...controllerProps} {...props} />}
 *     </EditController>
 * );
 */
export const EditController = ({
    children,
    ...props
}: {
    children: (params: EditControllerResult) => JSX.Element;
} & EditControllerProps) => {
    const controllerProps = useEditController(props);
    return children(controllerProps);
};
