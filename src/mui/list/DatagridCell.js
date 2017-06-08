import React from 'react';
import PropTypes from 'prop-types';
import defaultsDeep from 'lodash.defaultsdeep';
import { TableRowColumn } from 'material-ui/Table';
import FormField from '../form/FormField';

const DatagridCell = ({ className, field, record, basePath, resource, style, defaultStyle, ...rest }) => {
    const computedStyle = defaultsDeep({}, style, field.props.style, field.type.defaultProps ? field.type.defaultProps.style : {}, defaultStyle);
    if (field instanceof React.Component) {
        return (
            <TableRowColumn className={className} style={computedStyle} {...rest}>
                <div key={field.props.source} className={`aor-input-${field.props.source}`} style={field.props.style}>
                    <FormField input={field} resource={resource} record={record} basePath={basePath} />
                </div>
            </TableRowColumn>
        );
    }
    return (
        <TableRowColumn className={className} style={computedStyle} {...rest}>
            {React.cloneElement(field, { record, basePath, resource })}
        </TableRowColumn>
    );
};

DatagridCell.propTypes = {
    field: PropTypes.element,
    record: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    basePath: PropTypes.string,
    resource: PropTypes.string,
    style: PropTypes.object,
    defaultStyle: PropTypes.shape({
        td: PropTypes.object,
        'td:first-child': PropTypes.object,
    }),
};

export default DatagridCell;
