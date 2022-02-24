import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { FieldProps, useTranslate, useRecordContext } from 'react-admin';
import segments from '../segments/data';
import { Customer } from '../types';

const PREFIX = 'SegmentsField';

const classes = {
    main: `${PREFIX}-main`,
    chip: `${PREFIX}-chip`,
};

const Root = styled('span')({
    [`&.${classes.main}`]: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: -8,
        marginBottom: -8,
    },
    [`& .${classes.chip}`]: { margin: 4 },
});

const SegmentsField = (props: FieldProps) => {
    const translate = useTranslate();
    const record = useRecordContext<Customer>();

    return record ? (
        <Root className={classes.main}>
            {record.groups &&
                record.groups.map(segmentId => {
                    const segment = segments.find(s => s.id === segmentId);

                    return segment ? (
                        <Chip
                            size="small"
                            key={segment.id}
                            className={classes.chip}
                            label={translate(segment.name)}
                        />
                    ) : null;
                })}
        </Root>
    ) : null;
};

SegmentsField.defaultProps = {
    source: 'groups',
};

export default SegmentsField;
