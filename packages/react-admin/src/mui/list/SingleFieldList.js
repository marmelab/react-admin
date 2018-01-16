import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withStyles } from 'material-ui/styles';

const styles = {
    root: { display: 'flex', flexWrap: 'wrap' },
};

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
const SingleFieldList = ({
    classes = {},
    className,
    currentSort,
    ids,
    isLoading,
    data,
    resource,
    basePath,
    children,
    ...rest
}) => (
    <div className={classnames(classes.root, className)} {...rest}>
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
    classes: PropTypes.object,
    className: PropTypes.string,
};

export default withStyles(styles)(SingleFieldList);
