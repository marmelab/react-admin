import React, { Children, cloneElement, Component } from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import CloseIcon from 'material-ui-icons/RemoveCircleOutline';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/AddCircleOutline';

import { withStyles } from 'material-ui/styles';

import FormInput from '../form/FormInput';

const styles = theme => ({
    root: {
        padding: 0,
        marginBottom: 0,
    },
    line: {
        display: 'flex',
        listStyleType: 'none',
        borderBottom: `solid 1px ${theme.palette.divider}`,
        '&:last-child': {
            borderBottom: 'none',
        },
        [theme.breakpoints.down('xs')]: { display: 'block' },
    },
    index: {
        width: '3em',
        paddingTop: '1em',
        [theme.breakpoints.down('sm')]: { display: 'none' },
    },
    form: { flex: 2 },
    action: {
        paddingTop: '0.5em',
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
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
            <ul className={classes.root}>
                {submitFailed && error && <span>{error}</span>}
                {fields.map((member, index) => (
                    <li key={index} className={classes.line}>
                        <Typography variant="body1" className={classes.index}>
                            {index + 1}
                        </Typography>
                        <section className={classes.form}>
                            {Children.map(children, input => (
                                <FormInput
                                    basePath={basePath}
                                    input={cloneElement(input, {
                                        source: `${member}.${input.props
                                            .source}`,
                                        label:
                                            input.props.label ||
                                            input.props.source,
                                    })}
                                    record={record}
                                    resource={resource}
                                />
                            ))}
                        </section>
                        <span className={classes.action}>
                            <Button
                                size="small"
                                onClick={this.removeField(index)}
                            >
                                <CloseIcon className={classes.leftIcon} />
                                Remove
                            </Button>
                        </span>
                    </li>
                ))}
                <li className={classes.line}>
                    <span className={classes.action}>
                        <Button size="small" onClick={this.addField}>
                            <AddIcon className={classes.leftIcon} />
                            Add
                        </Button>
                    </span>
                </li>
            </ul>
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
