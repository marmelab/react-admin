import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import pure from 'recompose/pure';
import compose from 'recompose/compose';
import { translate } from 'ra-core';
import Typography from '@material-ui/core/Typography';

import sanitizeRestProps from './sanitizeRestProps';

/**
 * Display a value in an enumeration
 *
 * Pass possible options as an array of objects in the 'choices' attribute.
 *
 * @example
 * const choices = [
 *    { id: 'M', name: 'Male' },
 *    { id: 'F', name: 'Female' },
 * ];
 * <SelectField source="gender" choices={choices} />
 *
 * By default, the text is built by
 * - finding a choice where the 'id' property equals the field value
 * - using the 'name' property an the option text
 *
 * You can also customize the properties to use for the value and text,
 * thanks to the 'optionValue' and 'optionText' attributes.
 *
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
 * ];
 * <SelectField source="author_id" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * `optionText` also accepts a function, so you can shape the option text at will:
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
 * <SelectField source="author_id" choices={choices} optionText={optionRenderer} />
 *
 * `optionText` also accepts a React Element, that will be cloned and receive
 * the related choice as the `record` prop. You can use Field components there.
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const FullNameField = ({ record }) => <Chip>{record.first_name} {record.last_name}</Chip>;
 * <SelectField source="gender" choices={choices} optionText={<FullNameField />}/>
 *
 * The current choice is translated by default, so you can use translation identifiers as choices:
 * @example
 * const choices = [
 *    { id: 'M', name: 'myroot.gender.male' },
 *    { id: 'F', name: 'myroot.gender.female' },
 * ];
 *
 * However, in some cases (e.g. inside a `<ReferenceField>`), you may not want
 * the choice to be translated. In that case, set the `translateChoice` prop to false.
 * @example
 * <SelectField source="gender" choices={choices} translateChoice={false}/>
 *
 * **Tip**: <ReferenceField> sets `translateChoice` to false by default.
 */
export const SelectField = ({
    className,
    source,
    record,
    choices,
    optionValue,
    optionText,
    translate,
    translateChoice,
    ...rest
}) => {
    const value = get(record, source);
    const choice = choices.find(c => c[optionValue] === value);
    if (!choice) return null;
    const choiceName = React.isValidElement(optionText) // eslint-disable-line no-nested-ternary
        ? React.cloneElement(optionText, { record: choice })
        : typeof optionText === 'function'
            ? optionText(choice)
            : choice[optionText];
    return (
        <Typography
            component="span"
            body1="body1"
            className={className}
            {...sanitizeRestProps(rest)}
        >
            {translateChoice
                ? translate(choiceName, { _: choiceName })
                : choiceName}
        </Typography>
    );
};

SelectField.propTypes = {
    addLabel: PropTypes.bool,
    basePath: PropTypes.string,
    className: PropTypes.string,
    cellClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    choices: PropTypes.arrayOf(PropTypes.object),
    label: PropTypes.string,
    optionText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.element,
    ]).isRequired,
    optionValue: PropTypes.string.isRequired,
    resource: PropTypes.string,
    record: PropTypes.object,
    sortBy: PropTypes.string,
    source: PropTypes.string.isRequired,
    translate: PropTypes.func.isRequired,
    translateChoice: PropTypes.bool.isRequired,
};

SelectField.defaultProps = {
    record: {},
    optionText: 'name',
    optionValue: 'id',
    translateChoice: true,
};

const enhance = compose(
    pure,
    translate
);

const EnhancedSelectField = enhance(SelectField);

EnhancedSelectField.defaultProps = {
    addLabel: true,
};

export default EnhancedSelectField;
