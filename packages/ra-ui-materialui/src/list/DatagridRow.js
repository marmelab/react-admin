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
            basePath,
            children,
            classes,
            className,
            hasBulkActions,
            hover,
            id,
            record,
            resource,
            selected,
            style,
            styles,
            ...rest
        } = this.props;
        return (
            <TableRow
                className={className}
                key={id}
                style={style}
                hover={hover}
                {...sanitizeRestProps(rest)}
            >
                {hasBulkActions && (
                    <TableCell padding="none">
                        <Checkbox
                            color="primary"
                            className={`select-item ${classes.checkbox}`}
                            checked={selected}
                            onClick={this.handleToggle}
                        />
                    </TableCell>
                )}
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
    basePath: PropTypes.string,
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    hasBulkActions: PropTypes.bool.isRequired,
    hover: PropTypes.bool,
    id: PropTypes.any,
    onToggleItem: PropTypes.func,
    record: PropTypes.object.isRequired,
    resource: PropTypes.string,
    selected: PropTypes.bool,
    style: PropTypes.object,
    styles: PropTypes.object,
};

DatagridRow.defaultProps = {
    hasBulkActions: false,
    hover: true,
    record: {},
    selected: false,
};

export default DatagridRow;
