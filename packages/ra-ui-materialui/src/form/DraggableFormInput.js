import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/RemoveCircleOutline';
import MoveIcon from '@material-ui/icons/Reorder';
import { Draggable } from 'react-beautiful-dnd';
import { translate } from 'ra-core';

import FormInput from '../form/FormInput';

const styles = theme => ({
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

export const DraggableFormInput = ({
    basePath,
    children,
    classes = {},
    id,
    index,
    member,
    onRemove,
    record,
    resource,
    translate,
}) => (
    <Draggable draggableId={id} index={index}>
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
                                source: `${member}.${input.props.source}`,
                                label: input.props.label || input.props.source,
                            })}
                            record={record}
                            resource={resource}
                        />
                    ))}
                </section>
                <span className={classes.action}>
                    <Button size="small" onClick={onRemove(index)}>
                        <CloseIcon className={classes.leftIcon} />
                        {translate('ra.action.remove')}
                    </Button>
                </span>
            </li>
        )}
    </Draggable>
);

DraggableFormInput.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    classes: PropTypes.object,
    id: PropTypes.number,
    index: PropTypes.number,
    member: PropTypes.string,
    onRemove: PropTypes.func,
    record: PropTypes.object,
    resource: PropTypes.string,
    translate: PropTypes.func,
};

export default compose(translate, withStyles(styles))(DraggableFormInput);
