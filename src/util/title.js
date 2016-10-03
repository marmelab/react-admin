import inflection from 'inflection';

export default (label, source) => typeof label !== 'undefined' ? label : inflection.humanize(source); // eslint-disable-line no-confusing-arrow
