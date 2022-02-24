import * as React from 'react';
import { Children, ReactNode } from 'react';
import PropTypes from 'prop-types';

import { FilterForm } from './FilterForm';
import { FilterButton } from './FilterButton';
import { FilterContext } from '../FilterContext';

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
export const Filter = (props: FilterProps) => {
    const { children } = props;
    const renderButton = () => {
        return <FilterButton className={FilterClasses.button} />;
    };

    const renderForm = () => {
        return <FilterForm className={FilterClasses.form} />;
    };

    return (
        <FilterContext.Provider value={Children.toArray(children)}>
            {props.context === 'button' ? renderButton() : renderForm()}
        </FilterContext.Provider>
    );
};

Filter.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    context: PropTypes.oneOf(['form', 'button']),
};

const PREFIX = 'RaFilter';

export const FilterClasses = {
    button: `${PREFIX}-button`,
    form: `${PREFIX}-form`,
};

export interface FilterProps {
    children: ReactNode;
    context?: 'form' | 'button';
    variant?: string;
}
