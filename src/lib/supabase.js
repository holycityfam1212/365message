
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance = null;

if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.warn("Supabase keys missing. Database features will be disabled.");
    // Mock client to prevent crash
    supabaseInstance = {
        from: () => ({
            select: () => Promise.resolve({ data: [], error: null, count: 0 }),
            insert: () => Promise.resolve({ data: [], error: null }),
        })
    };
}

export const supabase = supabaseInstance;
