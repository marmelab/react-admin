import merge from 'lodash.merge';
import buildDataProvider from 'ra-data-graphql';
import buildQuery from './buildQuery';

const defaultOptions = {
    buildQuery,
};

export default options => {
    return buildDataProvider(merge({}, defaultOptions, options));
};
