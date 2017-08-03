import React from 'react';
import PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import { TableBody, TableRow } from 'material-ui/Table';

const DatagridBody = ({
    resource,
    children,
    ids,
    data,
    basePath,
    styles,
    rowStyle,
    options,
    rowOptions,
    ...rest
}) =>
    <TableBody
        displayRowCheckbox={false}
        className="datagrid-body"
        {...rest}
        {...options}
    >
        {ids.map((id, rowIndex) =>
            <TableRow
                style={rowStyle ? rowStyle(data[id], rowIndex) : styles.tr}
                key={id}
                selectable={false}
                {...rowOptions}
            >
                {React.Children.map(children, (field, index) =>
                    React.cloneElement(field, {
                        context: 'datagridCell',
                        className: `column-${field.props.source}`,
                        record: data[id],
                        defaultStyle:
                            index === 0
                                ? styles.cell['td:first-child']
                                : styles.cell.td,
                        field,
                        basePath,
                        resource,
                    })
                )}
            </TableRow>
        )}
    </TableBody>;

DatagridBody.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node.isRequired,
    data: PropTypes.object.isRequired,
    ids: PropTypes.arrayOf(PropTypes.any).isRequired,
    isLoading: PropTypes.bool,
    options: PropTypes.object,
    resource: PropTypes.string,
    rowOptions: PropTypes.object,
    rowStyle: PropTypes.func,
    styles: PropTypes.object,
};

DatagridBody.defaultProps = {
    data: {},
    ids: [],
};

const PureDatagridBody = shouldUpdate(
    (props, nextProps) => nextProps.isLoading === false
)(DatagridBody);

// trick material-ui Table into thinking this is one of the child type it supports
PureDatagridBody.muiName = 'TableBody';

export default PureDatagridBody;
