import {
    useShowController,
    ShowProps,
    ShowControllerProps,
} from './useShowController';
import { Translate } from '../../types';
import { useTranslate } from '../../i18n';

interface ShowControllerComponentProps extends ShowControllerProps {
    translate: Translate;
}

interface Props extends ShowProps {
    children: (params: ShowControllerComponentProps) => JSX.Element;
}

/**
 * Render prop version of the useShowController hook
 *
 * @see useShowController
 * @example
 *
 * const ShowView = () => <div>...</div>
 * const MyShow = props => (
 *     <ShowController {...props}>
 *         {controllerProps => <ShowView {...controllerProps} {...props} />}
 *     </ShowController>
 * );
 */
export const ShowController = ({ children, ...props }: Props) => {
    const controllerProps = useShowController(props);
    const translate = useTranslate(); // injected for backwards compatibility
    return children({ translate, ...controllerProps });
};
