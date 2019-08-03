import React, {
    Component,
    Fragment,
    isValidElement,
    cloneElement,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import { linkToRecord } from 'ra-core';
import classNames from 'classnames';

import DatagridCell from './DatagridCell';
import ExpandRowButton from './ExpandRowButton';

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

export class DatagridRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            colSpan: this.computeColSpan(props),
        };
    }

    componentDidUpdate = (prevProps, prevState) => {
        const colSpan = this.computeColSpan(this.props);
        if (colSpan !== prevState.colSpan) {
            this.setState({ colSpan });
        }
    };

    handleToggleExpanded = event => {
        this.setState(state => ({ expanded: !state.expanded }));
        event.stopPropagation();
    };

    handleToggle = event => {
        this.props.onToggleItem(this.props.id);
        event.stopPropagation();
    };

    handleClick = async event => {
        const { basePath, rowClick, id, record } = this.props;

        if (!rowClick) return;

        const path =
            typeof rowClick === 'function'
                ? await rowClick(id, basePath, record)
                : rowClick;

        this.handleRedirection(path, event);
    };

    handleRedirection = (path, event) => {
        const { basePath, id, push } = this.props;

        switch (path) {
            case 'edit':
                push(linkToRecord(basePath, id));
                return;
            case 'show':
                push(linkToRecord(basePath, id, 'show'));
                return;
            case 'expand':
                this.handleToggleExpanded(event);
                return;
            case 'toggleSelection':
                this.handleToggle(event);
                return;
            default:
                if (path) push(path);
                return;
        }
    };

    computeColSpan = props => {
        const { children, hasBulkActions } = props;
        return (
            1 + // show expand button
            (hasBulkActions ? 1 : 0) + // checkbox column
            React.Children.toArray(children).filter(child => !!child).length // non-null children
        );
    };

    render() {
        const {
            basePath,
            children,
            classes,
            className,
            expand,
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
        const { expanded, colSpan } = this.state;
        return (
            <Fragment>
                <TableRow
                    className={className}
                    key={id}
                    style={style}
                    hover={hover}
                    onClick={this.handleClick}
                    {...sanitizeRestProps(rest)}
                >
                    {expand && (
                        <TableCell
                            padding="none"
                            className={classes.expandIconCell}
                        >
                            <ExpandRowButton
                                className={classes.expandButton}
                                classes={classes}
                                expanded={expanded}
                                onClick={this.handleToggleExpanded}
                                expandContentId={`${id}-expand`}
                            />
                        </TableCell>
                    )}
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
                    {React.Children.map(children, (field, index) =>
                        isValidElement(field) ? (
                            <DatagridCell
                                key={`${id}-${field.props.source || index}`}
                                className={classNames(
                                    `column-${field.props.source}`,
                                    classes.rowCell
                                )}
                                record={record}
                                padding={
                                    !!expand || hasBulkActions
                                        ? 'none'
                                        : undefined
                                }
                                {...{ field, basePath, resource }}
                            />
                        ) : null
                    )}
                </TableRow>
                {expand && expanded && (
                    <TableRow key={`${id}-expand`} id={`${id}-expand`}>
                        <TableCell colSpan={colSpan}>
                            {cloneElement(expand, {
                                record,
                                basePath,
                                resource,
                                id: String(id),
                            })}
                        </TableCell>
                    </TableRow>
                )}
            </Fragment>
        );
    }
}

DatagridRow.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    expand: PropTypes.element,
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
