import React, { PropTypes } from 'react';
import shouldUpdate from 'recompose/shouldUpdate';
import DatagridCell from './DatagridCell';

const DatagridBody = ({ resource, children, ids, data, basePath, styles, rowStyle }) => (
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
);

DatagridBody.propTypes = {
    ids: PropTypes.arrayOf(PropTypes.any).isRequired,
    isLoading: PropTypes.bool,
    resource: PropTypes.string,
    data: PropTypes.object.isRequired,
    basePath: PropTypes.string,
    styles: PropTypes.object,
    rowStyle: PropTypes.func,
};

DatagridBody.defaultProps = {
    data: {},
    ids: [],
};

export default shouldUpdate((props, nextProps) => nextProps.isLoading === false)(DatagridBody);
