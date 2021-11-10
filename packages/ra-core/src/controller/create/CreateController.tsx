import { Translate } from '../../types';
import { useTranslate } from '../../i18n';
import {
    useCreateController,
    CreateProps,
    CreateControllerProps,
} from './useCreateController';

interface CreateControllerComponentProps extends CreateControllerProps {
    translate: Translate;
}

interface Props extends CreateProps {
    children: (params: CreateControllerComponentProps) => JSX.Element;
}

/**
 * Render prop version of the useCreateController hook
 *
 * @see useCreateController
 * @example
 *
 * const CreateView = () => <div>...</div>
 * const MyCreate = props => (
 *     <CreateController {...props}>
 *         {controllerProps => <CreateView {...controllerProps} {...props} />}
 *     </CreateController>
 * );
 */
export const CreateController = ({ children, ...props }: Props) => {
    const controllerProps = useCreateController(props);
    const translate = useTranslate(); // injected for backwards compatibility
    return children({ translate, ...controllerProps });
};
