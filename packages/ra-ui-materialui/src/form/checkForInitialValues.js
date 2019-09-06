import merge from 'lodash/merge';

const checkForInitialValues = (initialValues, newValues) => {
    // library issue via https://github.com/final-form/react-final-form/issues/130#issuecomment-493447888
    const emptiedData = Object.keys(initialValues).reduce((acc, key) => {
        if (typeof newValues[key] === 'object' && newValues[key] !== null) {
            acc[key] = checkForInitialValues(
                initialValues[key],
                newValues[key]
            );
        } else {
            acc[key] =
                typeof newValues[key] === 'undefined' ? '' : newValues[key];
        }
        return acc;
    }, {});

    // need to deep merge to get new child properties
    return merge(emptiedData, newValues);
};

export default checkForInitialValues;
