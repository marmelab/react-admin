import React from 'react';
import PropTypes from 'prop-types';

/**
 * Iterator component to be used to display a list of entities, using a single field
 *
 * @example Display all the books by the current author
 * <ReferenceManyField reference="books" target="author_id">
 *     <SingleFieldList>
 *         <ChipField source="title" />
 *     </SingleFieldList>
 * </ReferenceManyField>
 */
const SingleFieldList = ({ ids, data, resource, basePath, children }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {ids.map(id =>
            React.cloneElement(children, {
                key: id,
                record: data[id],
                resource,
                basePath,
            })
        )}
    </div>
);

SingleFieldList.propTypes = {
    children: PropTypes.element.isRequired,
};

export default SingleFieldList;
