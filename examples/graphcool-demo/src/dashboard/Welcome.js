import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import LightBulbIcon from '@material-ui/icons/LightbulbOutline';
import HomeIcon from '@material-ui/icons/Home';
import CodeIcon from '@material-ui/icons/Code';
import { translate } from 'react-admin';

export default translate(({ style, translate }) => (
    <Card style={style}>
        <CardHeader
            title={translate('pos.dashboard.welcome.title')}
            subheader={translate('pos.dashboard.welcome.subtitle')}
            avatar={
                <Avatar>
                    <LightBulbIcon />
                </Avatar>
            }
        />
        <CardActions style={{ textAlign: 'right' }}>
            <Button href="https://marmelab.com/react-admin">
                <HomeIcon style={{ paddingRight: '0.5em' }} />
                {translate('pos.dashboard.welcome.aor_button')}
            </Button>
            <Button href="https://github.com/marmelab/react-admin">
                <CodeIcon style={{ paddingRight: '0.5em' }} />
                {translate('pos.dashboard.welcome.demo_button')}
            </Button>
        </CardActions>
    </Card>
));
