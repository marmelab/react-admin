import React from 'react';
import PropTypes from 'prop-types';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { sanitizeListRestProps } from 'ra-core';
import { CardActions, CreateButton, ExportButton } from 'react-admin';

const TreeListActions = ({
    basePath,
    className,
    closeNode,
    currentSort,
    expandNode,
    exporter,
    hasCreate,
    hasEdit,
    hasList,
    hasShow,
    loading,
    parentSource,
    permanentFilter,
    positionSource,
    resource,
    toggleNode,
    total,
    ...rest
}) => (
    <CardActions className={className} {...sanitizeListRestProps(rest)}>
        {hasCreate && <CreateButton basePath={basePath} />}
        {exporter !== false && (
            <ExportButton
                disabled={total === 0}
                resource={resource}
                sort={currentSort}
                filter={permanentFilter}
                exporter={exporter}
            />
        )}
    </CardActions>
);

TreeListActions.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    exporter: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    hasCreate: PropTypes.bool,
    resource: PropTypes.string,
};

export default onlyUpdateForKeys(['resource'])(TreeListActions);
