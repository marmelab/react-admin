import PropTypes from 'prop-types';

import defaultGetTreeFromArray from './getTreeFromArray';

export const TreeController = ({
    basePath,
    children,
    ids,
    data: { fetchedAt, ...data },
    getTreeFromArray,
    parentSource,
    resource,
}) => {
    const availableData = ids.reduce((acc, id) => [...acc, data[id]], []);
    const tree = getTreeFromArray(Object.values(availableData), parentSource);

    return children({ basePath, ids, data, parentSource, resource, tree });
};

TreeController.propTypes = {
    basePath: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
    ids: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired,
    getTreeFromArray: PropTypes.func,
    parentSource: PropTypes.string,
    resource: PropTypes.string.isRequired,
};

TreeController.defaultProps = {
    getTreeFromArray: defaultGetTreeFromArray,
    parentSource: 'parent_id',
};

export default TreeController;
