import * as React from 'react';
import { FieldTitle, useResourceContext } from 'ra-core';
import { Switch, Typography } from '@mui/material';
import DragIcon from '@mui/icons-material/DragIndicator';
import { styled } from '@mui/material/styles';

/**
 * UI to enable/disable a field
 */
export const FieldToggle = props => {
    const { selected, label, onToggle, onMove, source, index } = props;
    const resource = useResourceContext();
    const dropIndex = React.useRef<number | null>(null);
    const x = React.useRef<number | null>(null);
    const y = React.useRef<number | null>(null);

    const handleDocumentDragOver = React.useCallback(event => {
        x.current = event.clientX;
        y.current = event.clientY;
    }, []);

    const handleDragStart = () => {
        document.addEventListener('dragover', handleDocumentDragOver);
    };

    const handleDrag = event => {
        // imperative DOM manipulations using the native Drag API
        const selectedItem = event.target;
        selectedItem.classList.add('drag-active');
        const list = selectedItem.closest('ul');
        if (x.current == null || y.current == null) {
            return;
        }
        const elementAtDragCoordinates = document.elementFromPoint(
            x.current,
            y.current
        );
        let dropItem =
            elementAtDragCoordinates === null
                ? selectedItem
                : elementAtDragCoordinates.closest('li');

        if (!dropItem) {
            return;
        }
        if (dropItem.classList.contains('dragIcon')) {
            dropItem = dropItem.parentNode;
        }
        if (dropItem === selectedItem) {
            return;
        }
        if (list === dropItem.parentNode.closest('ul')) {
            dropIndex.current = dropItem.dataset.index;
            if (dropItem === selectedItem.nextSibling) {
                dropItem = dropItem.nextSibling;
            }
            list.insertBefore(selectedItem, dropItem);
        }
    };

    const handleDragEnd = event => {
        const selectedItem = event.target as HTMLElement;
        const list = selectedItem.closest('ul');

        const elementFromPoint =
            x.current != null && y.current != null
                ? document.elementFromPoint(x.current, y.current)
                : null;

        let dropItem =
            x.current == null || y.current == null || elementFromPoint === null
                ? selectedItem
                : elementFromPoint.closest('li');

        if (y.current !== null && list && !dropItem) {
            const closestUL = selectedItem.closest('ul');
            if (
                closestUL &&
                y.current > closestUL.getBoundingClientRect().bottom
            ) {
                dropItem = list.lastChild as HTMLElement;
            } else {
                dropItem = list.firstChild as HTMLElement;
            }
        }

        if (dropItem && list === dropItem.closest('ul')) {
            onMove(selectedItem.dataset.index, dropIndex.current);
        } else {
            event.preventDefault();
            event.stopPropagation();
        }
        selectedItem.classList.remove('drag-active');
        document.removeEventListener('dragover', handleDocumentDragOver);
    };

    const handleDragOver = event => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    return (
        <Root
            key={source}
            draggable={onMove ? 'true' : undefined}
            onDrag={onMove ? handleDrag : undefined}
            onDragStart={onMove ? handleDragStart : undefined}
            onDragEnd={onMove ? handleDragEnd : undefined}
            onDragOver={onMove ? handleDragOver : undefined}
            data-index={index}
        >
            <label htmlFor={`switch_${index}`}>
                <Switch
                    checked={selected}
                    onChange={onToggle}
                    name={index}
                    id={`switch_${index}`}
                    size="small"
                    sx={{ mr: 0.5, ml: -0.5 }}
                />
                <Typography variant="body2" component="span">
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                    />
                </Typography>
            </label>
            {onMove && (
                <DragIcon
                    className="dragIcon"
                    color="disabled"
                    fontSize="small"
                />
            )}
        </Root>
    );
};

const Root = styled('li', {
    name: 'RaFieldToggle',
    overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: 0,
    '& svg': {
        cursor: 'move',
    },
    '&.drag-active': {
        background: 'transparent',
        color: 'transparent',
        outline: `1px solid ${theme.palette.action.selected}`,
        '& .MuiSwitch-root, & svg': {
            visibility: 'hidden',
        },
    },
}));
