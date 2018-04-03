import React, { Children, cloneElement, Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import AddIcon from 'material-ui-icons/Add';
import RemoveIcon from 'material-ui-icons/Remove';
import { withStyles } from 'material-ui/styles';

import FormInput from '../form/FormInput';

const styles = theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '1em',
        fontFamily: theme.typography.fontFamily,
        lineHeight: '1.1875em',
    },
    line: {
        flexGrow: 1,
        margin: '0.5em 0',
        padding: '0 1em 1em 1em',
    },
    remove: {
        float: 'right',
        marginRight: '-0.5em',
    },
    add: {
        textAlign: 'right',
    },
});

export class SimpleFormIterator extends Component {
    removeField = index => () => {
        const { fields } = this.props;
        fields.remove(index);
    };

    addField = () => {
        const { fields } = this.props;
        fields.push({});
    };

    render() {
        const {
            basePath,
            classes = {},
            children,
            fields,
            meta: { error, submitFailed },
            record,
            resource,
        } = this.props;
        return fields ? (
            <div className={classes.root}>
                {submitFailed && error && <span>{error}</span>}
                {fields.map((member, index) => (
                    <Paper key={index} className={classes.line}>
                        <IconButton
                            className={classes.remove}
                            color="primary"
                            aria-label="Remove"
                            onClick={this.removeField(index)}
                        >
                            <RemoveIcon />
                        </IconButton>
                        {Children.map(children, input => (
                            <FormInput
                                basePath={basePath}
                                input={cloneElement(input, {
                                    source: `${member}.${input.props.source}`,
                                    label:
                                        input.props.label || input.props.source,
                                })}
                                record={record}
                                resource={resource}
                            />
                        ))}
                    </Paper>
                ))}
                <div className={classes.add}>
                    <IconButton
                        color="primary"
                        aria-label="Add"
                        onClick={this.addField}
                    >
                        <AddIcon />
                    </IconButton>
                </div>
            </div>
        ) : null;
    }
}

SimpleFormIterator.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    fields: PropTypes.object,
    meta: PropTypes.object,
    record: PropTypes.object,
    resource: PropTypes.string,
};

export default withStyles(styles)(SimpleFormIterator);
