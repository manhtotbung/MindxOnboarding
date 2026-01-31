import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

// --- AUTHENTICATION ROUTES ---

// 1. Login Endpoint - Redirects to OpenID Provider
// Support both /auth and /api/auth paths via router mounting in index.ts
router.get(['/login', '/auth/login'], (req: Request, res: Response) => {
    const clientId = process.env.OPENID_CLIENT_ID || 'PLACEHOLDER_ID';
    const redirectUri = process.env.OPENID_REDIRECT_URI || 'http://localhost:3000/auth/callback';
    const issuer = process.env.OPENID_ISSUER || 'https://id-dev.mindx.edu.vn';

    // Construct Authorization URL
    const authUrl = `${issuer}/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20profile%20email`;

    res.redirect(authUrl);
});

// 2. Callback Endpoint - Handles the code from OpenID Provider
router.get(['/callback', '/auth/callback'], async (req: Request, res: Response) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send('No code returned from provider');
    }

    try {
        const issuer = process.env.OPENID_ISSUER || 'https://id-dev.mindx.edu.vn';
        const clientId = process.env.OPENID_CLIENT_ID;
        const clientSecret = process.env.OPENID_CLIENT_SECRET;
        const redirectUri = process.env.OPENID_REDIRECT_URI;

        console.log('Exchanging code for token with redirect_uri:', redirectUri);

        // Exchange code for Token
        const response = await axios.post(`${issuer}/token`, new URLSearchParams({
            grant_type: 'authorization_code',
            code: code as string,
            redirect_uri: redirectUri as string,
            client_id: clientId as string,
            client_secret: clientSecret as string
        }).toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { id_token } = response.data; // Use id_token for standard OIDC verification
        console.log('Authentication Successful. Token received.');

        // Determine redirect target
        if (process.env.NODE_ENV === 'production') {
            // Production: Redirect to root with query param (Same domain)
            res.redirect(`/?token=${id_token}`);
        } else {
            // Local Dev: Redirect to Vite frontend
            res.redirect(`http://localhost:5173/?token=${id_token}`);
        }

    } catch (error: any) {
        console.error('Auth Error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Authentication failed',
            details: error.response?.data || error.message
        });
    }
});

export default router;
