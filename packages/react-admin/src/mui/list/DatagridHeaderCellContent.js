import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from 'material-ui/Button';
import ContentSort from 'material-ui-icons/Sort';

import FieldTitle from '../../util/FieldTitle';

export const DatagridHeaderCellContent = ({
    classes = {},
    field,
    currentSort,
    updateSort,
    resource,
}) => {
    return field.props.sortable !== false && field.props.source ? (
        <Button
            onClick={updateSort}
            data-sort={field.props.source}
            className={classes.sortButton}
        >
            <FieldTitle
                label={field.props.label}
                source={field.props.source}
                resource={resource}
            />

            {field.props.source === currentSort.field && (
                <ContentSort
                    className={classNames(
                        classes.sortIcon,
                        currentSort.order === 'ASC'
                            ? classes.sortIconReversed
                            : ''
                    )}
                />
            )}
        </Button>
    ) : (
        <span className={classes.nonSortableLabel}>
            {
                <FieldTitle
                    label={field.props.label}
                    source={field.props.source}
                    resource={resource}
                />
            }
        </span>
    );
};

DatagridHeaderCellContent.propTypes = {
    classes: PropTypes.object,
    field: PropTypes.element,
    currentSort: PropTypes.shape({
        sort: PropTypes.string,
        order: PropTypes.string,
    }),
    isSorting: PropTypes.bool,
    sortable: PropTypes.bool,
    resource: PropTypes.string,
    updateSort: PropTypes.func,
};

export default DatagridHeaderCellContent;
