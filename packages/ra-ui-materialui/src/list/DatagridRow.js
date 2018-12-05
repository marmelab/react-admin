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

    handleClick = async () => {
        const { basePath, rowClick, id, record } = this.props;

        if (!rowClick) return;

        if (typeof rowClick === 'function') {
            const path = await rowClick(id, basePath, record);
            console.log({ path })
            this.handleRedirection(path);
            return;
        }

        this.handleRedirection(rowClick);
    };

    handleRedirection = path => {
        const { basePath, id, push } = this.props;

        if (path === 'edit') {
            push(linkToRecord(basePath, id));
            return;
        }
        if (path === 'show') {
            push(linkToRecord(basePath, id, 'show'));
            return;
        }

        push(path);
    }

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

// wat? TypeScript looses the displayName if we don't set it explicitly
DatagridRow.displayName = 'DatagridRow';

export default connect(
    null,
    { push }
)(DatagridRow);
