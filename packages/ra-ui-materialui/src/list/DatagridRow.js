import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import classnames from 'classnames';
import { linkToRecord } from 'ra-core';

import DatagridCell from './DatagridCell';

const sanitizeRestProps = ({
    basePath,
    children,
    classes,
    className,
    rowClick,
    id,
    isLoading,
    onToggleItem,
    push,
    record,
    resource,
    selected,
    style,
    styles,
    ...rest
}) => rest;

class DatagridRow extends Component {
    handleToggle = event => {
        this.props.onToggleItem(this.props.id);
        event.stopPropagation();
    };

    handleClick = () => {
        const { basePath, rowClick, id, push } = this.props;
        if (!rowClick) return;
        if (rowClick === 'edit') {
            push(linkToRecord(basePath, id));
        }
        if (rowClick === 'show') {
            push(linkToRecord(basePath, id, 'show'));
        }
        if (typeof rowClick === 'function') {
            push(rowClick(id, basePath));
        }
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
                onClick={this.handleClick}
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
    push: PropTypes.func,
    record: PropTypes.object.isRequired,
    resource: PropTypes.string,
    rowClick: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
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

export default connect(
    null,
    { push }
)(DatagridRow);
