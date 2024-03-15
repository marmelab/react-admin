import { useWarnWhenUnsavedChanges } from './useWarnWhenUnsavedChanges';

export const WarnWhenUnsavedChanges = ({
    enable = true,
    formRootPathName,
    formControl,
}) => {
    useWarnWhenUnsavedChanges(enable, formRootPathName, formControl);
    return null;
};
