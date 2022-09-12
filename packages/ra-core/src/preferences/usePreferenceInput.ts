import { useState, useEffect } from 'react';

import { useStore } from '../store/useStore';

/**
 * Build props for a preference input that changes the value on blur
 *
 * @example
 * const FontSizePreferenceInput = () => {
 *     const field = usePreferenceInput('ui.font.size', 10);
 *     return (
 *         <div>
 *             <label for="font-size">Font size</label>
 *             <input id="font-size" {...field} />
 *         </div>
 *     );
 * }
 */
export const usePreferenceInput = (key, defaultValue) => {
    const [valueFromStore, setValueFromStore] = useStore(key);
    const [value, setValue] = useState(valueFromStore || defaultValue);
    useEffect(() => {
        setValue(valueFromStore || defaultValue);
    }, [valueFromStore, defaultValue]);

    const onChange = event => {
        setValue(event.target.value === '' ? defaultValue : event.target.value);
    };

    const onBlur = () => {
        setValueFromStore(value);
    };

    const onKeyDown = event => {
        if (event.key === 'Enter') {
            setValueFromStore(value);
            const form = event.target.form;
            if (form) {
                const index = [...form].indexOf(event.target);
                form.elements[index + 1]?.focus();
            }
            event.preventDefault();
        }
    };

    return { value, onChange, onBlur, onKeyDown };
};
