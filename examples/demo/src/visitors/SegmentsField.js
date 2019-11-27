import React from 'react';
import Chip from '@material-ui/core/Chip';
import { useTranslate } from 'react-admin';
import segments from '../segments/data';

const styles = {
    main: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: -8,
        marginBottom: -8,
    },
    chip: { margin: 4 },
};

const SegmentsField = ({ record }) => {
    const translate = useTranslate();
    return (
        <span style={styles.main}>
            {record.groups &&
                record.groups.map(segment => (
                    <Chip
                        key={segment}
                        style={styles.chip}
                        label={translate(
                            segments.find(s => s.id === segment).name
                        )}
                    />
                ))}
        </span>
    );
};

SegmentsField.defaultProps = {
    addLabel: true,
    source: 'groups',
};

export default SegmentsField;
