import { AdminGuesser } from 'ra-supabase';
import { Layout } from './Layout';

const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const VITE_SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;

export const App = () => (
    <AdminGuesser
        instanceUrl={VITE_SUPABASE_URL}
        apiKey={VITE_SUPABASE_API_KEY}
        layout={Layout}
    />
);
