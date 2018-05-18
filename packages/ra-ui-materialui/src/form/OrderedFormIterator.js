import React, { Children, cloneElement, Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/RemoveCircleOutline';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import MoveIcon from '@material-ui/icons/Reorder';
import { translate } from 'ra-core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import FormInput from '../form/FormInput';

const styles = theme => ({
    root: {
        padding: 0,
        marginBottom: 0,
        '& > li:last-child': {
            borderBottom: 'none',
        },
    },
    line: {
        display: 'flex',
        listStyleType: 'none',
        borderBottom: `solid 1px ${theme.palette.divider}`,
        [theme.breakpoints.down('xs')]: { display: 'block' },
        '&.fade-enter': {
            opacity: 0.01,
            transform: 'translateX(100vw)',
        },
        '&.fade-enter-active': {
            opacity: 1,
            transform: 'translateX(0)',
            transition: 'all 500ms ease-in',
        },
        '&.fade-exit': {
            opacity: 1,
            transform: 'translateX(0)',
        },
        '&.fade-exit-active': {
            opacity: 0.01,
            transform: 'translateX(100vw)',
            transition: 'all 500ms ease-in',
        },
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

export class OrderedFormIterator extends Component {
    constructor(props) {
        super(props);
        // we need a unique id for each field for a proper enter/exit animation
        // but redux-form doesn't provide one (cf https://github.com/erikras/redux-form/issues/2735)
        // so we keep an internal map between the field position and an autoincrement id
        this.nextId = 0;
        this.ids = props.fields ? props.fields.map(() => this.nextId++) : [];
    }

    removeField = index => () => {
        const { fields } = this.props;
        this.ids.splice(index, 1);
        fields.remove(index);
    };

    addField = () => {
        const { fields } = this.props;
        this.ids.push(this.nextId++);
        fields.push({});
    };

    onDragEnd = result => {
        if (!result.destination) {
            return;
        }
        const { fields } = this.props;
        const startIndex = result.source.index;
        const endIndex = result.destination.index;
        const [removed] = this.ids.splice(startIndex, 1);
        this.ids.splice(endIndex, 0, removed);
        fields.move(startIndex, endIndex);
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
            translate,
        } = this.props;
        return fields ? (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                    {provided => (
                        <ul className={classes.root} ref={provided.innerRef}>
                            {submitFailed && error && <span>{error}</span>}
                            <TransitionGroup>
                                {fields.map((member, index) => (
                                    <CSSTransition
                                        key={this.ids[index]}
                                        timeout={500}
                                        classNames="fade"
                                    >
                                        <Draggable
                                            key={this.ids[index]}
                                            draggableId={this.ids[index]}
                                            index={index}
                                        >
                                            {provided => (
                                                <li
                                                    className={classes.line}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                >
                                                    <MoveIcon
                                                        className={classes.index}
                                                        {...provided.dragHandleProps}
                                                    />
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
                                                            <CloseIcon
                                                                className={classes.leftIcon}
                                                            />
                                                            {translate('ra.action.remove')}
                                                        </Button>
                                                    </span>
                                                </li>
                                            )}
                                        </Draggable>
                                    </CSSTransition>
                                ))}
                            </TransitionGroup>
                            <li className={classes.line}>
                                <span className={classes.action}>
                                    <Button size="small" onClick={this.addField}>
                                        <AddIcon className={classes.leftIcon} />
                                        {translate('ra.action.add')}
                                    </Button>
                                </span>
                            </li>
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        ) : null;
    }
}

OrderedFormIterator.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    fields: PropTypes.object,
    meta: PropTypes.object,
    record: PropTypes.object,
    resource: PropTypes.string,
    translate: PropTypes.func,
};

export default compose(translate, withStyles(styles))(OrderedFormIterator);
