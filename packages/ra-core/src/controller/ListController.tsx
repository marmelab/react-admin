import useListController, {
    ListProps,
    ListControllerProps,
} from './useListController';
import { useTranslate } from '../i18n';
import { Translate } from '../types';

interface ListControllerComponentProps extends ListControllerProps {
    translate: Translate;
}

interface Props extends ListProps {
    children: (params: ListControllerComponentProps) => JSX.Element;
}

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
const ListController = ({ children, ...props }: Props) => {
    const controllerProps = useListController(props);
    const translate = useTranslate(); // injected for backwards compatibility
    return children({ translate, ...controllerProps });
};

export default ListController;
