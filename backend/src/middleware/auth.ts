import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';

// Extend Express Request to include user info
export interface AuthRequest extends Request {
    user?: any;
}

// TODO: Update with actual OpenID configuration when credentials are available
const GOOGLE_CLIENT_ID = process.env.OPENID_CLIENT_ID;
const ISSUER = process.env.OPENID_ISSUER || 'https://id-dev.mindx.edu.vn';

// Middleware to validate JWT
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    // Option 1: Verify using a static secret (if symmetric key is used - e.g. for testing)
    if (process.env.JWT_SECRET) {
        jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
            if (err) return res.status(403).json({ error: 'Invalid token' });
            req.user = user;
            next();
        });
        return;
    }

    // Option 2: Verify using JWKS (standard OIDC - requires JWKS endpoint)
    // We need to know the JWKS URI from the discovery endpoint
    // For now, this is a placeholder. 
    console.warn('JWT verification skipped (No JWT_SECRET provided). THIS IS FOR DEV ONLY.');

    // TEMPORARY: Decode without verification just to populate req.user 
    // DO NOT USE IN PRODUCTION without verification
    const decoded = jwt.decode(token);
    if (decoded) {
        req.user = decoded;
        next();
    } else {
        res.status(403).json({ error: 'Invalid token format' });
    }
};
