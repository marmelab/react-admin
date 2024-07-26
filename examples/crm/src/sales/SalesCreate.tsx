import { Create, PasswordInput, required, SimpleForm } from 'react-admin';
import { SalesInputs } from './SalesInputs';
import { Container, Typography } from '@mui/material';

export function SalesCreate() {
    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Create redirect="list">
                <SimpleForm>
                    <Typography variant="h6">Create sale guy</Typography>
                    <SalesInputs>
                        <PasswordInput
                            source="password"
                            validate={required()}
                            helperText={false}
                        />
                    </SalesInputs>
                </SimpleForm>
            </Create>
        </Container>
    );
}
