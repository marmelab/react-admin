const checkConstraint = (record, field, constraint) => {
    if (typeof constraint.custom === 'function') {
        return constraint.custom(record[field], record);
    }

    if (constraint.required) {
        if (typeof record[field] === 'undefined' || record[field] === null || record[field] === '') {
            return 'Required field';
        }
    }

    if (typeof constraint.min !== 'undefined') {
        if (parseInt(record[field], 10) < constraint.min) {
            return `Minimum value: ${constraint.min}`;
        }
    }

    if (typeof constraint.max !== 'undefined') {
        if (parseInt(record[field], 10) > constraint.max) {
            return `Maximum value: ${constraint.max}`;
        }
    }

    return '';
};

export default (record, field, constraints = []) => {
    if (!constraints.length) {
        return '';
    }

    return constraints.reduce(
        (error, constraint) => error || checkConstraint(record, field, constraint),
        ''
    );
};
