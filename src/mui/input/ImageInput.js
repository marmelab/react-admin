import { FileInput } from './FileInput';
import translate from '../../i18n/translate';

export class ImageInput extends FileInput {
    static defaultProps = {
        ...FileInput.defaultProps,
        labelMultiple: 'aor.input.image.upload_several',
        labelSingle: 'aor.input.image.upload_single',
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

export default translate(ImageInput);
