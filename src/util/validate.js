export default (record, field, validators) => {
    if (!validators[field]) {
        return '';
    }

    if (typeof validators[field].custom === 'function') {
        return validators[field].custom(record[field], record);
    }

    if (validators[field].required) {
        if (!record[field]) {
            return 'Required field';
        }
    }

    if (typeof validators[field].min !== 'undefined') {
        if (parseInt(record[field], 10) < validators[field].min) {
            return `Minimum value: ${validators[field].min}`;
        }
    }

    if (typeof validators[field].max !== 'undefined') {
        if (parseInt(record[field], 10) > validators[field].max) {
            return `Maximum value: ${validators[field].max}`;
        }
    }

    return '';
};
