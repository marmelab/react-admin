import React, { PropTypes } from 'react';
import defaultsDeep from 'lodash.defaultsdeep';
import { TableHeaderColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import ContentSort from 'material-ui/svg-icons/content/sort';
import title from '../../util/title';

const DatagridHeaderCell = ({ field, defaultStyle, isFirst, currentSort, updateSort }) => {
    const styles = defaultsDeep({}, field.props.headerStyle, defaultStyle);
    return (
        <TableHeaderColumn style={isFirst ? { ...styles.th, ...styles['th:first-child'] } : styles.th}>
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
    isFirst: PropTypes.bool,
    currentSort: PropTypes.shape({
        sort: PropTypes.string,
        order: PropTypes.string,
    }),
    updateSort: PropTypes.func.isRequired,
};

export default DatagridHeaderCell;
