import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TableCell, TableRow } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import classnames from 'classnames';

import DatagridCell from './DatagridCell';

const sanitizeRestProps = ({
    classes,
    className,
    resource,
    children,
    id,
    isLoading,
    record,
    basePath,
    selected,
    styles,
    style,
    onToggleItem,
    ...rest
}) => rest;

class DatagridRow extends Component {
    handleToggle = () => {
        this.props.onToggleItem(this.props.id);
    };

    render() {
        const {
            classes,
            className,
            resource,
            children,
            id,
            record,
            basePath,
            selected,
            styles,
            style,
            ...rest
        } = this.props;
        return (
            <TableRow
                className={className}
                key={id}
                style={style}
                {...sanitizeRestProps(rest)}
            >
                <TableCell padding="checkbox">
                    <Checkbox
                        className="select-item"
                        checked={selected}
                        onClick={this.handleToggle}
                    />
                </TableCell>
                {React.Children.map(
                    children,
                    (field, index) =>
                        field ? (
                            <DatagridCell
                                key={`${id}-${field.props.source || index}`}
                                className={classnames(
                                    `column-${field.props.source}`,
                                    classes.rowCell
                                )}
                                record={record}
                                id={id}
                                {...{ field, basePath, resource }}
                            />
                        ) : null
                )}
            </TableRow>
        );
    }
}

DatagridRow.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    id: PropTypes.any,
    resource: PropTypes.string,
    record: PropTypes.object.isRequired,
    basePath: PropTypes.string,
    selected: PropTypes.bool,
    style: PropTypes.func,
    styles: PropTypes.object,
    onToggleItem: PropTypes.func,
};

DatagridRow.defaultProps = {
    record: {},
    selected: false,
};

export default DatagridRow;
