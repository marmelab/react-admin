import CodeIcon from '@mui/icons-material/Code';
import HomeIcon from '@mui/icons-material/Home';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Typography,
} from '@mui/material';

export const Welcome = () => (
    <Card
        sx={{
            background: `#c5dedd`,
            color: 'rgba(0, 0, 0, 0.87)',
            padding: '1em',
            [`& .MuiCardActions-root`]: {
                p: 2,
                mt: -2,
                mb: -1,
                flexDirection: 'column',
                '& a': {
                    mb: 1,
                    color: 'rgba(0, 0, 0, 0.87)',
                    backgroundColor: 'white',
                    marginLeft: '0 !important',
                },
            },
        }}
    >
        <CardContent>
            <Typography variant="h5" gutterBottom>
                CRM demo
            </Typography>
            <Typography variant="body2" gutterBottom>
                This app runs in the browser, and relies on a mock REST API.
                Feel free to explore and modify the data - it's local to your
                computer, and will reset each time you reload.
            </Typography>
            <Typography variant="body2" gutterBottom>
                It was built using react-admin, an open-source framework. The
                code for this demo is also open-source. Reading it is a great
                way to learn react-admin!
            </Typography>
        </CardContent>
        <CardActions>
            <Button
                variant="contained"
                fullWidth
                href="https://marmelab.com/react-admin"
                startIcon={<HomeIcon />}
            >
                React-admin site
            </Button>
            <Button
                variant="contained"
                fullWidth
                href="https://github.com/marmelab/react-admin/tree/master/examples/crm"
                startIcon={<CodeIcon />}
            >
                Source of this demo
            </Button>
        </CardActions>
    </Card>
);
