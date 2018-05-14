import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const Poster = ({ record }) => (
    <Card style={{ display: 'inline-block', marginTop: '1em', zIndex: 2 }}>
        <CardContent>
            <img
                src={record.image}
                alt=""
                style={{
                    width: 'initial',
                    minWidth: 'initial',
                    maxWidth: '42em',
                    maxHeight: '15em',
                }}
            />
        </CardContent>
    </Card>
);

export default Poster;
