import inflection from 'inflection';

export default (label, source) => {
    if (typeof label !== 'undefined') return label;
    if (typeof source !== 'undefined') return inflection.humanize(source);
    return '';
};
