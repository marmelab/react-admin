import React, { Component } from 'react';
import inflection from 'inflection';
import { withStyles } from '@material-ui/core/styles';
import { ListController, getElementsFromRecords, InferredElement } from 'ra-core';
import { ListView, styles } from './List';
import listFieldTypes from './listFieldTypes';

export class ListViewGuesser extends Component {
    state = {
        inferredChild: null,
    };
    componentDidUpdate() {
        const { ids, data, resource } = this.props;
        if (ids.length > 0 && data && !this.state.inferredChild) {
            const inferredElements = getElementsFromRecords(ids.map(id => data[id]), listFieldTypes);
            const inferredChild = new InferredElement(listFieldTypes.table, null, inferredElements);

            process.env.NODE_ENV !== 'production' &&
                // eslint-disable-next-line no-console
                console.log(
                    `Guessed List:

export const ${inflection.capitalize(inflection.singularize(resource))}List = props => (
    <List {...props}>
${inferredChild.getRepresentation()}
    </List>
);`
                );
            this.setState({ inferredChild: inferredChild.getElement() });
        }
    }

    render() {
        return <ListView {...this.props}>{this.state.inferredChild}</ListView>;
    }
}

ListViewGuesser.propTypes = ListView.propTypes;

const ListGuesser = props => (
    <ListController {...props}>{controllerProps => <ListViewGuesser {...props} {...controllerProps} />}</ListController>
);

export default withStyles(styles)(ListGuesser);
