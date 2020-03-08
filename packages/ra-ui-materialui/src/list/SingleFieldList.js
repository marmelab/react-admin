import React, { cloneElement, Children } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import { linkToRecord } from 'ra-core';

import Link from '../Link';

const useStyles = makeStyles(
    theme => ({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            marginTop: -theme.spacing(1),
            marginBottom: -theme.spacing(1),
        },
    }),
    { name: 'RaSingleFieldList' }
);

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

const sanitizeRestProps = ({
    currentSort,
    setSort,
    loading,
    loaded,
    ...props
}) => props;

// Our handleClick does nothing as we wrap the children inside a Link but it is
// required by ChipField, which uses a Chip from material-ui.
// The material-ui Chip requires an onClick handler to behave like a clickable element.
const handleClick = () => {};

/**
 * Iterator component to be used to display a list of entities, using a single field
 *
 * @example Display all the books by the current author
 * <ReferenceManyField reference="books" target="author_id">
 *     <SingleFieldList>
 *         <ChipField source="title" />
 *     </SingleFieldList>
 * </ReferenceManyField>
 *
 * By default, it includes a link to the <Edit> page of the related record
 * (`/books/:id` in the previous example).
 *
 * Set the linkType prop to "show" to link to the <Show> page instead.
 *
 * @example
 * <ReferenceManyField reference="books" target="author_id" linkType="show">
 *     <SingleFieldList>
 *         <ChipField source="title" />
 *     </SingleFieldList>
 * </ReferenceManyField>
 *
 * You can also prevent `<SingleFieldList>` from adding link to children by setting
 * `linkType` to false.
 *
 * @example
 * <ReferenceManyField reference="books" target="author_id" linkType={false}>
 *     <SingleFieldList>
 *         <ChipField source="title" />
 *     </SingleFieldList>
 * </ReferenceManyField>
 */
function SingleFieldList({
    classes: classesOverride,
    className,
    ids,
    data,
    loaded,
    resource,
    basePath,
    children,
    linkType,
    ...rest
}) {
    const classes = useStyles({ classes: classesOverride });

    if (loaded === false) {
        return <LinearProgress />;
    }

    return (
        <div
            className={classnames(classes.root, className)}
            {...sanitizeRestProps(rest)}
        >
            {ids.map(id => {
                const resourceLinkPath = !linkType
                    ? false
                    : linkToRecord(basePath, id, linkType);

                if (resourceLinkPath) {
                    return (
                        <Link
                            className={classes.link}
                            key={id}
                            to={resourceLinkPath}
                            onClick={stopPropagation}
                        >
                            {cloneElement(Children.only(children), {
                                record: data[id],
                                resource,
                                basePath,
                                // Workaround to force ChipField to be clickable
                                onClick: handleClick,
                            })}
                        </Link>
                    );
                }

                return cloneElement(Children.only(children), {
                    key: id,
                    record: data[id],
                    resource,
                    basePath,
                });
            })}
        </div>
    );
}

SingleFieldList.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.element.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string,
    data: PropTypes.object,
    ids: PropTypes.array,
    linkType: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
        .isRequired,
    resource: PropTypes.string,
};

SingleFieldList.defaultProps = {
    classes: {},
    linkType: 'edit',
};

export default SingleFieldList;
