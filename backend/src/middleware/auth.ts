import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';

// Extend Express Request to include user info
export interface AuthRequest extends Request {
    user?: any;
}

// Middleware to validate JWT
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    // Verify using a static secret (if configured in .env)
    if (process.env.JWT_SECRET) {
        // Try verifying with secret first
        jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
            if (!err) {
                req.user = user;
                next();
                return;
            }
            // If secret verification fails (e.g. token is from MindX), fall through to JWKS
            verifyJwks(req, res, next, token);
        });
        return;
    }

    // Verify using JWKS (standard OIDC)
    verifyJwks(req, res, next, token);
};

// Helper function for JWKS Verification
const verifyJwks = (req: AuthRequest, res: Response, next: NextFunction, token: string) => {
    const issuer = process.env.OPENID_ISSUER || 'https://id-dev.mindx.edu.vn';
    const client = jwksRsa({
        jwksUri: `${issuer}/jwks`,
        cache: true,
        rateLimit: true,
    });

    function getKey(header: any, callback: any) {
        client.getSigningKey(header.kid, function (err, key) {
            if (err) {
                // If can't get the key (e.g. network error or invalid kid), fail
                callback(err, null);
                return;
            }
            const signingKey = key?.getPublicKey();
            callback(null, signingKey);
        });
    }

    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err: any, user: any) => {
        if (err) {
            console.error('JWKS Verification failed:', err.message);
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};
