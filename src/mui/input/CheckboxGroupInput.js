import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import Checkbox from 'material-ui/Checkbox';
import muiThemeable from 'material-ui/styles/muiThemeable';
import compose from 'recompose/compose';

import FieldTitle from '../../util/FieldTitle';
import translate from '../../i18n/translate';

const getStyles = muiTheme => {
    const {
        baseTheme,
        textField: { floatingLabelColor, backgroundColor },
    } = muiTheme;

    return {
        labelContainer: {
            fontSize: 16,
            lineHeight: '24px',
            display: 'inline-block',
            position: 'relative',
            backgroundColor,
            fontFamily: baseTheme.fontFamily,
            cursor: 'auto',
            marginTop: 14,
        },
        label: {
            color: floatingLabelColor,
            lineHeight: '22px',
            zIndex: 1,
            transform: 'scale(0.75)',
            transformOrigin: 'left top',
            pointerEvents: 'none',
            userSelect: 'none',
        },
    };
};

/**
 * An Input component for a checkbox group, using an array of objects for the options
 *
 * Pass possible options as an array of objects in the 'choices' attribute.
 *
 * The expected input must be an array of identifiers (e.g. [12, 31]) which correspond to
 * the 'optionValue' of 'choices' attribute objects.
 *
 * By default, the options are built from:
 *  - the 'id' property as the option value,
 *  - the 'name' property an the option text
 * @example
 * const choices = [
 *     { id: 12, name: 'Ray Hakt' },
 *     { id: 31, name: 'Ann Gullar' },
 *     { id: 42, name: 'Sean Phonee' },
 * ];
 * <CheckboxGroupInput source="recipients" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi' },
 *    { _id: 456, full_name: 'Jane Austen' },
 * ];
 * <CheckboxGroupInput source="recipients" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * `optionText` also accepts a function, so you can shape the option text at will:
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
 * <CheckboxGroupInput source="recipients" choices={choices} optionText={optionRenderer} />
 *
 * `optionText` also accepts a React Element, that will be cloned and receive
 * the related choice as the `record` prop. You can use Field components there.
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const FullNameField = ({ record }) => <span>{record.first_name} {record.last_name}</span>;
 * <CheckboxGroupInput source="recipients" choices={choices} optionText={<FullNameField />}/>
 *
 * The choices are translated by default, so you can use translation identifiers as choices:
 * @example
 * const choices = [
 *    { id: 'programming', name: 'myroot.category.programming' },
 *    { id: 'lifestyle', name: 'myroot.category.lifestyle' },
 *    { id: 'photography', name: 'myroot.category.photography' },
 * ];
 *
 * However, in some cases (e.g. inside a `<ReferenceInput>`), you may not want
 * the choice to be translated. In that case, set the `translateChoice` prop to false.
 * @example
 * <CheckboxGroupInput source="gender" choices={choices} translateChoice={false}/>
 *
 * The object passed as `options` props is passed to the material-ui <Checkbox> components
 */
export class CheckboxGroupInputComponent extends Component {
    handleCheck = (event, isChecked) => {
        const { input: { value, onChange } } = this.props;

        if (isChecked) {
            onChange([...value, ...[event.target.value]]);
        } else {
            onChange(value.filter(v => v != event.target.value));
        }
    };

    renderCheckbox = choice => {
        const {
            input: { value },
            optionText,
            optionValue,
            options,
            translate,
            translateChoice,
        } = this.props;
        const choiceName = React.isValidElement(optionText) // eslint-disable-line no-nested-ternary
            ? React.cloneElement(optionText, { record: choice })
            : typeof optionText === 'function'
              ? optionText(choice)
              : get(choice, optionText);
        return (
            <Checkbox
                key={get(choice, optionValue)}
                checked={
                    value ? (
                        value.find(v => v == get(choice, optionValue)) !==
                        undefined
                    ) : (
                        false
                    )
                }
                onCheck={this.handleCheck}
                value={get(choice, optionValue)}
                label={
                    translateChoice ? (
                        translate(choiceName, { _: choiceName })
                    ) : (
                        choiceName
                    )
                }
                {...options}
            />
        );
    };

    render() {
        const {
            choices,
            isRequired,
            label,
            muiTheme,
            resource,
            source,
        } = this.props;
        const styles = getStyles(muiTheme);
        const { prepareStyles } = muiTheme;

        return (
            <div>
                <div style={prepareStyles(styles.labelContainer)}>
                    <div style={prepareStyles(styles.label)}>
                        <FieldTitle
                            label={label}
                            source={source}
                            resource={resource}
                            isRequired={isRequired}
                        />
                    </div>
                </div>
                {choices.map(this.renderCheckbox)}
            </div>
        );
    }
}

CheckboxGroupInputComponent.propTypes = {
    addField: PropTypes.bool.isRequired,
    choices: PropTypes.arrayOf(PropTypes.object),
    label: PropTypes.string,
    source: PropTypes.string,
    options: PropTypes.object,
    input: PropTypes.shape({
        onChange: PropTypes.func.isRequired,
    }),
    isRequired: PropTypes.bool,
    optionText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.element,
    ]).isRequired,
    optionValue: PropTypes.string.isRequired,
    resource: PropTypes.string,
    translate: PropTypes.func.isRequired,
    translateChoice: PropTypes.bool.isRequired,
    muiTheme: PropTypes.object.isRequired,
};

CheckboxGroupInputComponent.defaultProps = {
    addField: true,
    choices: [],
    options: {},
    optionText: 'name',
    optionValue: 'id',
    translateChoice: true,
};

const enhance = compose(translate, muiThemeable());

const CheckboxGroupInput = enhance(CheckboxGroupInputComponent);

CheckboxGroupInput.propTypes = {
    addField: PropTypes.bool.isRequired,
};

CheckboxGroupInput.defaultProps = {
    addField: true,
};

export default CheckboxGroupInput;
