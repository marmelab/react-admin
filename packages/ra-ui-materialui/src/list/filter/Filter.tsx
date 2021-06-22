import * as React from 'react';
import { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { sanitizeListRestProps, useListContext } from 'ra-core';

import FilterForm from './FilterForm';
import FilterButton from './FilterButton';
import { ClassesOverride } from '../../types';

const useStyles = makeStyles(
    {
        button: {},
        form: {},
    },
    { name: 'RaFilter' }
);

export interface FilterProps {
    children: ReactNode;
    classes?: ClassesOverride<typeof useStyles>;
    context?: 'form' | 'button';
    variant?: string;
}

/**
 * Filter button/form combo
 *
 * @example
 *
 * const PostFilter = (props) => (
 *     <Filter {...props}>
 *         <TextInput label="Search" source="q" alwaysOn />
 *         <TextInput label="Title" source="title" defaultValue="Hello, World!" />
 *     </Filter>
 * );
 *
 * export const PostList = (props) => (
 *     <List {...props} filters={<PostFilter />}>
 *         ...
 *     </List>
 * );
 *
 */
const Filter: FC<FilterProps> = props => {
    const classes = useStyles(props);
    const {
        resource,
        showFilter,
        hideFilter,
        setFilters,
        displayedFilters,
        filterValues,
    } = useListContext(props);
    const renderButton = () => {
        const {
            classes: classesOverride,
            context,
            children,
            variant,
            ...rest
        } = props;

        return (
            <FilterButton
                className={classes.button}
                resource={resource}
                filters={React.Children.toArray(children)}
                showFilter={showFilter}
                displayedFilters={displayedFilters}
                filterValues={filterValues}
                {...sanitizeListRestProps(rest)}
            />
        );
    };

    const renderForm = () => {
        const { classes: classesOverride, context, children, ...rest } = props;

        return (
            <FilterForm
                className={classes.form}
                resource={resource}
                filters={React.Children.toArray(children)}
                hideFilter={hideFilter}
                displayedFilters={displayedFilters}
                initialValues={filterValues}
                setFilters={setFilters}
                {...sanitizeListRestProps(rest)}
            />
        );
    };

    return props.context === 'button' ? renderButton() : renderForm();
};

Filter.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    context: PropTypes.oneOf(['form', 'button']),
};

export default Filter;
