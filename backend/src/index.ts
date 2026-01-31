import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { authenticateToken, AuthRequest } from './middleware/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/', (req: Request, res: Response) => {
    res.json({ message: 'Hello from Backend API!' });
});

// --- AUTHENTICATION ROUTES (Placeholder) ---
// 1. Login Endpoint - Redirects to OpenID Provider
// Support both /auth and /api/auth paths for flexibility
const loginPaths = ['/auth/login', '/api/auth/login'];
app.get(loginPaths, (req: Request, res: Response) => {
    const clientId = process.env.OPENID_CLIENT_ID || 'PLACEHOLDER_ID';
    // Use the configured URI from env, which dictates which cleanup path we expect
    const redirectUri = process.env.OPENID_REDIRECT_URI || 'http://localhost:3000/auth/callback';
    const issuer = process.env.OPENID_ISSUER || 'https://id-dev.mindx.edu.vn';

    // Construct Authorization URL
    // Scope: openid profile email
    // Response type: code
    const authUrl = `${issuer}/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20profile%20email`;

    res.redirect(authUrl);
});

// 2. Callback Endpoint - Handles the code from OpenID Provider
// Support both /auth and /api/auth paths for callback
const callbackPaths = ['/auth/callback', '/api/auth/callback'];
app.get(callbackPaths, async (req: Request, res: Response) => {
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

        const { access_token, id_token } = response.data;
        console.log('Authentication Successful. Token received.');

        // In local dev: redirect to frontend (Vite port 5173 usually)
        const frontendUrl = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5173';
        res.redirect(`${frontendUrl}/?token=${access_token}`);

    } catch (error: any) {
        console.error('Auth Error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Authentication failed',
            details: error.response?.data || error.message
        });
    }
});

// 3. Protected Route Example
app.get('/api/protected', authenticateToken, (req: AuthRequest, res: Response) => {
    res.json({
        message: 'This is a protected route!',
        user: req.user
    });
});
// -------------------------------------------

app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
