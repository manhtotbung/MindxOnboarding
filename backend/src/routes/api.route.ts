import { Router, Request, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// General API Routes

router.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello from Backend API!' });
});

router.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

// Protected Route Example
router.get('/protected', authenticateToken, (req: AuthRequest, res: Response) => {
    res.json({
        message: 'This is a protected route!',
        user: req.user
    });
});

export default router;
