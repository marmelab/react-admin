import merge from 'lodash.merge';
import buildClient from 'ra-data-graphql';
import buildQuery from './buildQuery';

const defaultOptions = {
    buildQuery,
};

export default options => {
    return buildClient(merge({}, defaultOptions, options));
};
