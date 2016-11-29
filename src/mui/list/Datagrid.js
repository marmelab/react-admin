import React, { Component, PropTypes } from 'react';
import DatagridCell from './DatagridCell';
import DatagridHeaderCell from './DatagridHeaderCell';

const defaultStyles = {
    table: {
        backgroundColor: '#fff',
        padding: '0px 24px',
        width: '100%',
        borderCollapse: 'collapse',
        borderSpacing: 0,
    },
    tbody: {
        height: 'inherit',
    },
    tr: {
        borderBottom: '1px solid rgb(224, 224, 224)',
        color: 'rgba(0, 0, 0, 0.870588)',
        height: 48,
    },
    header: {
        th: {
            padding: 0,
        },
        'th:first-child': {
            padding: '0 0 0 12px',
        },
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
    },
    cell: {
        td: {
            padding: '0 12px',
        },
        'td:first-child': {
            padding: '0 12px 0 24px',
        },
    },
};

class Datagrid extends Component {
    updateSort = (event) => {
        event.stopPropagation();
        this.props.setSort(event.currentTarget.dataset.sort);
    }

    render() {
        const { resource, children, ids, data, currentSort, basePath, styles = defaultStyles, rowStyle, updateSort } = this.props;
        return (
            <table style={styles.table}>
                <thead>
                    <tr style={styles.tr}>
                        {React.Children.map(children, (field, index) => (
                            <DatagridHeaderCell
                                key={field.props.source || index}
                                field={field}
                                defaultStyle={styles.header}
                                isFirst={index === 0}
                                currentSort={currentSort}
                                updateSort={this.updateSort}
                            />
                        ))}
                    </tr>
                </thead>
                <tbody style={styles.tbody}>
                    {ids.map((id, index) => (
                        <tr style={rowStyle ? rowStyle(data[id], index) : styles.tr} key={id}>
                            {React.Children.toArray(children).map((field, index) => (
                                <DatagridCell
                                    key={`${id}-${field.props.source || index}`}
                                    record={data[id]}
                                    defaultStyle={styles.cell}
                                    isFirst={index === 0}
                                    {...{ field, basePath, resource }}
                                />
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}

Datagrid.propTypes = {
    ids: PropTypes.arrayOf(PropTypes.any).isRequired,
    resource: PropTypes.string,
    data: PropTypes.object.isRequired,
    currentSort: PropTypes.shape({
        sort: PropTypes.string,
        order: PropTypes.string,
    }),
    basePath: PropTypes.string,
    setSort: PropTypes.func,
    styles: PropTypes.object,
    rowStyle: PropTypes.func,
};

Datagrid.defaultProps = {
    data: {},
    ids: [],
};

export default Datagrid;
