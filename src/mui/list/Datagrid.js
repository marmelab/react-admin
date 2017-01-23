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
    },
    cell: {
        td: {
            padding: '0 12px',
            whiteSpace: 'normal',
        },
        'td:first-child': {
            padding: '0 12px 0 16px',
            whiteSpace: 'normal',
        },
    },
};

/**
 * The Datagrid component renders a list of records as a table.
 * It is usually used as a child of the <List> and <ReferenceManyField> components.
 *
 * Props:
 *  - styles
 *  - rowStyle
 *
 * @example Display all posts as a datagrid
 * const postRowStyle = (record, index) => ({
 *     backgroundColor: record.nb_views >= 500 ? '#efe' : 'white',
 * });
 * export const PostList = (props) => (
 *     <List {...props}>
 *         <Datagrid rowStyle={postRowStyle}>
 *             <TextField source="id" />
 *             <TextField source="title" />
 *             <TextField source="body" />
 *             <EditButton />
 *         </Datagrid>
 *     </List>
 * );
 *
 * @example Display all the comments of the current post as a datagrid
 * <ReferenceManyField reference="comments" target="post_id">
 *     <Datagrid>
 *         <TextField source="id" />
 *         <TextField source="body" />
 *         <DateField source="created_at" />
 *         <EditButton />
 *     </Datagrid>
 * </ReferenceManyField>
 */
class Datagrid extends Component {
    updateSort = (event) => {
        event.stopPropagation();
        this.props.setSort(event.currentTarget.dataset.sort);
    }

    render() {
        const { resource, children, ids, data, currentSort, basePath, styles = defaultStyles, rowStyle } = this.props;
        return (
            <table style={styles.table}>
                <thead>
                    <tr style={styles.tr}>
                        {React.Children.map(children, (field, index) => (
                            <DatagridHeaderCell
                                key={field.props.source || index}
                                cacheKey={index}
                                field={field}
                                defaultStyle={index === 0 ? styles.header['th:first-child'] : styles.header.th}
                                currentSort={currentSort}
                                updateSort={this.updateSort}
                            />
                        ))}
                    </tr>
                </thead>
                <tbody style={styles.tbody}>
                    {ids.map((id, rowIndex) => (
                        <tr style={rowStyle ? rowStyle(data[id], rowIndex) : styles.tr} key={id}>
                            {React.Children.map(children, (field, index) => (
                                <DatagridCell
                                    key={`${id}-${field.props.source || index}`}
                                    record={data[id]}
                                    defaultStyle={index === 0 ? styles.cell['td:first-child'] : styles.cell.td}
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
