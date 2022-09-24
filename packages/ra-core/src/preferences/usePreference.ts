import { useStore } from '../store/useStore';
import { usePreferenceKey } from './PreferenceKeyContext';

export const usePreference = (key: string, defaultValue?: any) => {
    const preferenceKey = usePreferenceKey();
    return useStore(`${preferenceKey}.${key}`, defaultValue);
};
