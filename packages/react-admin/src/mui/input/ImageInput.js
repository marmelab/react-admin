import compose from 'recompose/compose';

import addField from '../form/addField';
import translate from '../../i18n/translate';
import { FileInput } from './FileInput';

export class ImageInput extends FileInput {
    static defaultProps = {
        ...FileInput.defaultProps,
        labelMultiple: 'ra.input.image.upload_several',
        labelSingle: 'ra.input.image.upload_single',
        itemStyle: {
            display: 'inline-block',
            position: 'relative',
        },
        removeStyle: {
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            minWidth: '2rem',
            opacity: 0,
        },
    };
}

export default compose(addField, translate)(ImageInput);
