import React, { PropTypes } from 'react';
import defaultsDeep from 'lodash.defaultsdeep';
import shouldUpdate from 'recompose/shouldUpdate';
import { TableHeaderColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import ContentSort from 'material-ui/svg-icons/content/sort';
import title from '../../util/title';

const styles = {
    sortButton: {
        minWidth: 40,
    },
    nonSortableLabel: {
        position: 'relative',
        paddingLeft: 16,
        paddingRight: 16,
        verticalAlign: 'middle',
        letterSpacing: 0,
        textTransform: 'uppercase',
        fontWeight: 500,
        fontSize: 14,
    },
};

const DatagridHeaderCell = ({ field, defaultStyle, currentSort, updateSort }) => {
    const style = defaultsDeep({}, field.props.headerStyle, field.type.defaultProps ? field.type.defaultProps.headerStyle : {}, defaultStyle);
    return (
        <TableHeaderColumn style={style}>
            {field.props.source ?
                <FlatButton
                    labelPosition="before"
                    onClick={updateSort}
                    data-sort={field.props.source}
                    label={title(field.props.label, field.props.source)}
                    icon={field.props.source === currentSort.field ?
                        <ContentSort style={currentSort.order === 'ASC' ? { transform: 'rotate(180deg)' } : {}} /> : false
                    }
                    style={styles.sortButton}
                />
                :
                (field.props.label && <span style={styles.nonSortableLabel}>{title(field.props.label, field.props.source)}</span>)
            }
        </TableHeaderColumn>
    );
};

DatagridHeaderCell.propTypes = {
    field: PropTypes.element,
    defaultStyle: PropTypes.shape({
        th: PropTypes.object,
        'th:first-child': PropTypes.object,
        sortButton: PropTypes.object,
        nonSortableLabel: PropTypes.object,
    }),
    currentSort: PropTypes.shape({
        sort: PropTypes.string,
        order: PropTypes.string,
    }),
    isSorting: PropTypes.bool,
    updateSort: PropTypes.func.isRequired,
};

export default shouldUpdate((props, nextProps) =>
    props.isSorting !== nextProps.isSorting
    || (nextProps.isSorting && props.currentSort.order !== nextProps.currentSort.order)
)(DatagridHeaderCell);
