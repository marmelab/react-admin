import compose from 'recompose/compose';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { addField, translate } from 'ra-core';

import { FileInput } from './FileInput';

const styles = theme =>
    createStyles({
        root: { width: '100%' },
        dropZone: {
            background: theme.palette.background.default,
            cursor: 'pointer',
            padding: '1rem',
            textAlign: 'center',
            color: theme.palette.text.hint,
        },
        preview: {},
        removeButton: {
            display: 'inline-block',
            position: 'relative',
            float: 'left',
            '& button': {
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                minWidth: '2rem',
                opacity: 0,
            },
            '&:hover button': {
                opacity: 1,
            },
        },
    });

export class ImageInput extends FileInput {
    static defaultProps = {
        ...FileInput.defaultProps,
        labelMultiple: 'ra.input.image.upload_several',
        labelSingle: 'ra.input.image.upload_single',
    };
}

export default compose(
    addField,
    translate,
    withStyles(styles)
)(ImageInput);
