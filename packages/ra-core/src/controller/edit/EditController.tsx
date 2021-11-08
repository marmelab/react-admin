import { Translate } from '../../types';
import { useTranslate } from '../../i18n';
import {
    useEditController,
    EditProps,
    EditControllerProps,
} from './useEditController';

interface EditControllerComponentProps extends EditControllerProps {
    translate: Translate;
}

interface Props extends EditProps {
    children: (params: EditControllerComponentProps) => JSX.Element;
}

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
export const EditController = ({ children, ...props }: Props) => {
    const controllerProps = useEditController(props);
    const translate = useTranslate(); // injected for backwards compatibility
    return children({ translate, ...controllerProps });
};
