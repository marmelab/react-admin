import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableHead, TableRow } from 'material-ui/Table';
import classnames from 'classnames';

import DatagridHeaderCell from './DatagridHeaderCell';
import DatagridBody from './DatagridBody';

const styles = {
    table: {
        tableLayout: 'auto',
    },
    tbody: {
        height: 'inherit',
    },
    headerCell: {
        padding: 0,
        '&:first-child': {
            padding: '0 0 0 12px',
        },
    },
    row: {},
    rowEven: {},
    rowOdd: {},
    rowCell: {
        padding: '0 12px',
        whiteSpace: 'normal',
        '&:first-child': {
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
 *  - options (passed as props to <Table>)
 *  - headerOptions (passed as props to mui <TableHead>)
 *  - bodyOptions (passed as props to mui <TableBody>)
 *  - rowOptions (passed as props to mui <TableRow>)
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
    updateSort = event => {
        event.stopPropagation();
        this.props.setSort(event.currentTarget.dataset.sort);
    };

    render() {
        const {
            resource,
            children,
            classes,
            className,
            ids,
            isLoading,
            data,
            currentSort,
            basePath,
            headerOptions,
            bodyOptions,
            rowOptions,
            rowStyle,
            ...rest
        } = this.props;
        return (
            <Table className={classnames(classes.table, className)} {...rest}>
                <TableHead {...headerOptions}>
                    <TableRow className={classes.row}>
                        {React.Children.map(
                            children,
                            (field, index) =>
                                field ? (
                                    <DatagridHeaderCell
                                        key={field.props.source || index}
                                        field={field}
                                        className={classes.headerCell}
                                        currentSort={currentSort}
                                        isSorting={
                                            field.props.source ===
                                            currentSort.field
                                        }
                                        updateSort={this.updateSort}
                                        resource={resource}
                                    />
                                ) : null
                        )}
                    </TableRow>
                </TableHead>
                <DatagridBody
                    resource={resource}
                    ids={ids}
                    data={data}
                    basePath={basePath}
                    classes={classes}
                    isLoading={isLoading}
                    options={bodyOptions}
                    rowOptions={rowOptions}
                    rowStyle={rowStyle}
                >
                    {children}
                </DatagridBody>
            </Table>
        );
    }
}

Datagrid.propTypes = {
    basePath: PropTypes.string,
    bodyOptions: PropTypes.object,
    currentSort: PropTypes.shape({
        sort: PropTypes.string,
        order: PropTypes.string,
    }),
    children: PropTypes.node.isRequired,
    data: PropTypes.object.isRequired,
    headerOptions: PropTypes.object,
    ids: PropTypes.arrayOf(PropTypes.any).isRequired,
    isLoading: PropTypes.bool,
    resource: PropTypes.string,
    rowOptions: PropTypes.object,
    rowStyle: PropTypes.func,
    setSort: PropTypes.func,
    classes: PropTypes.object,
    className: PropTypes.string,
};

Datagrid.defaultProps = {
    data: {},
    ids: [],
};

export default withStyles(styles)(Datagrid);
