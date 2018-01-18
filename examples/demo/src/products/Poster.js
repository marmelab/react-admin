import React from 'react';
import Card, { CardContent } from 'material-ui/Card';

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
