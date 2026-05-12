// Auth.js v5 catch-all route handler.
// Serves /api/auth/signin, /api/auth/signout, /api/auth/callback/*, etc.

import { handlers } from '@/auth';
export const { GET, POST } = handlers;
