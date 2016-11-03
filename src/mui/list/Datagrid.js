import React, { Component, PropTypes } from 'react';
import { TableHeaderColumn, TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import ContentSort from 'material-ui/svg-icons/content/sort';
import title from '../../util/title';

const styles = {
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
};

class Datagrid extends Component {
    updateSort = (event) => {
        event.stopPropagation();
        this.props.setSort(event.currentTarget.dataset.sort);
    }

    render() {
        const { resource, children, ids, data, currentSort, basePath, updateSort } = this.props;
        return (
            <table style={styles.table}>
                <thead>
                    <tr style={styles.tr}>
                        {React.Children.toArray(children).map(field => (
                            <TableHeaderColumn key={field.props.label || field.props.source || 'no-key'}>
                                {(field.props.label || field.props.source) &&
                                    <FlatButton
                                        labelPosition="before"
                                        onClick={this.updateSort}
                                        data-sort={field.props.source}
                                        label={title(field.props.label, field.props.source)}
                                        icon={field.props.source === currentSort.sort ? <ContentSort style={currentSort.order === 'ASC' ? { transform: 'rotate(180deg)' } : {}} /> : false}
                                    />
                                }
                            </TableHeaderColumn>
                        ))}
                    </tr>
                </thead>
                <tbody style={styles.tbody}>
                    {ids.map(id => (
                        <tr style={styles.tr} key={id}>
                            {React.Children.toArray(children).map(field => (
                                <TableRowColumn key={`${id}-${field.props.source}`}>
                                    <field.type {...field.props} record={data[id]} basePath={basePath} resource={resource} />
                                </TableRowColumn>
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
};

Datagrid.defaultProps = {
    data: {},
    ids: [],
};

export default Datagrid;
