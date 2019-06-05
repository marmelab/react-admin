import React, { Component } from 'react';
import inflection from 'inflection';
import { withStyles } from '@material-ui/core/styles';
import { EditController, InferredElement, getElementsFromRecords } from 'ra-core';
import { EditView, styles } from './Edit';
import editFieldTypes from './editFieldTypes';

export class EditViewGuesser extends Component {
    state = {
        inferredChild: null,
    };
    componentDidUpdate() {
        const { record, resource } = this.props;
        if (record && !this.state.inferredChild) {
            const inferredElements = getElementsFromRecords([record], editFieldTypes);
            const inferredChild = new InferredElement(editFieldTypes.form, null, inferredElements);

            process.env.NODE_ENV !== 'production' &&
                // eslint-disable-next-line no-console
                console.log(
                    `Guessed Edit:

export const ${inflection.capitalize(inflection.singularize(resource))}Edit = props => (
    <Edit {...props}>
${inferredChild.getRepresentation()}
    </Edit>
);`
                );
            this.setState({ inferredChild: inferredChild.getElement() });
        }
    }

    render() {
        return <EditView {...this.props}>{this.state.inferredChild}</EditView>;
    }
}

EditViewGuesser.propTypes = EditView.propTypes;

const EditGuesser = props => (
    <EditController {...props}>{controllerProps => <EditViewGuesser {...props} {...controllerProps} />}</EditController>
);

export default withStyles(styles)(EditGuesser);
