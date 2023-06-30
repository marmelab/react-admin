import { ReactElement } from 'react';
import { useNotify } from '../notification';
import {
    UseCheckForApplicationUpdateOptions,
    useCheckForApplicationUpdate,
} from './useCheckForApplicationUpdate';

export const CheckForApplicationUpdate = (
    props: CheckForApplicationUpdateProps
) => {
    const { updateMode = 'manual', notification, ...rest } = props;
    const notify = useNotify();

    const onNewVersionAvailable = () => {
        if (updateMode === 'immediate') {
            window.location.reload();
        } else {
            notify(notification, {
                type: 'info',
                autoHideDuration: 0,
            });
        }
    };

    useCheckForApplicationUpdate({ onNewVersionAvailable, ...rest });
    return null;
};

export interface CheckForApplicationUpdateProps
    extends Partial<UseCheckForApplicationUpdateOptions> {
    notification?: string | ReactElement;
}
