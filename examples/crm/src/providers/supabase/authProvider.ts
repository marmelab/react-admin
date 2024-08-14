import { supabaseAuthProvider } from 'ra-supabase';
import { AuthProvider } from 'react-admin';
import { supabase } from './supabase';

const baseAuthProvider = supabaseAuthProvider(supabase, {
    getIdentity: async user => {
        const { data, error } = await supabase
            .from('sales')
            .select('id, first_name, last_name, avatar')
            .match({ user_id: user.id })
            .single();

        if (!data || error) {
            throw new Error();
        }

        return {
            id: data.id,
            fullName: `${data.first_name} ${data.last_name}`,
            avatar: data.avatar?.src,
        };
    },
    getPermissions: async user => {
        const { data, error } = await supabase
            .from('sales')
            .select('administrator')
            .match({ user_id: user.id })
            .single();

        if (!data || error) {
            return null;
        }

        return data?.administrator ? 'admin' : 'user';
    },
});

export async function getIsInitialized() {
    if (getIsInitialized._is_initialized_cache == null) {
        const { data } = await supabase
            .from('init_state')
            .select('is_initialized');

        getIsInitialized._is_initialized_cache =
            data?.at(0)?.is_initialized > 0;
    }

    return getIsInitialized._is_initialized_cache;
}

export namespace getIsInitialized {
    export var _is_initialized_cache: boolean | null = null;
}

export const authProvider: AuthProvider = {
    ...baseAuthProvider,
    checkAuth: async params => {
        // Users are on the set-password page, nothing to do
        if (
            window.location.pathname === '/set-password' ||
            window.location.hash.includes('#/set-password')
        ) {
            return;
        }
        // Users are on the forgot-password page, nothing to do
        if (
            window.location.pathname === '/forgot-password' ||
            window.location.hash.includes('#/forgot-password')
        ) {
            return;
        }
        // Users are on the sign-up page, nothing to do
        if (
            window.location.pathname === '/sign-up' ||
            window.location.hash.includes('#/sign-up')
        ) {
            return;
        }

        const isInitialized = await getIsInitialized();

        if (!isInitialized) {
            await supabase.auth.signOut();
            // eslint-disable-next-line no-throw-literal
            throw {
                redirectTo: '/sign-up',
                message: false,
            };
        }

        return baseAuthProvider.checkAuth(params);
    },
    async getPermissions(params) {
        const isInitialized = await getIsInitialized();
        return isInitialized ? baseAuthProvider.getPermissions(params) : null;
    },
};
