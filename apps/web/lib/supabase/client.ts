import { createClient, SupabaseClient } from '@supabase/supabase-js';

const envObj = (globalThis as any).process?.env || {};

export const SUPABASE_URL =
  envObj.NEXT_PUBLIC_SUPABASE_URL || 'https://pzhlfdhiawiujjkyczsi.supabase.co';
export const SUPABASE_ANON_KEY =
  envObj.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6aGxmZGhpYXdpdWpqa3ljenNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU3MDg4NjIsImV4cCI6MjExMTI4NDg2Mn0.vAW277niXnNjWpLDTL5IYNFBItmvgZtBWNKEvyxVHyw';

export const GATEWISE_EDGE_URL =
  envObj.NEXT_PUBLIC_GATEWISE_EDGE_URL || `${SUPABASE_URL}/functions/v1/gatewise-api`;

let browserClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!browserClient) {
    browserClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      realtime: {
        params: { eventsPerSecond: 10 },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return browserClient;
}
