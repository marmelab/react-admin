import { createSelector } from 'reselect';

const getDefaultValues = (data = {}, defaultValue = {}, defaultValues = {}) => {
    const globalDefaultValue = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    return { ...globalDefaultValue, ...defaultValues, ...data };
};

const getRecord = (state, props) => props.record;
const getDefaultValue = (state, props) => props.defaultValue;
const getDefaultValuesFromState = state => state.admin.record;

export default createSelector(
    getRecord,
    getDefaultValue,
    getDefaultValuesFromState,
    (record, defaultValue, defaultValues) => getDefaultValues(record, defaultValue, defaultValues)
);
