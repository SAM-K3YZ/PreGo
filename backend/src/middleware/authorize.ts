import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticate';
import { UserRole } from '../models/User';

// Role-based access control. Usage: router.get('/x', authenticate, authorize('doctor'), handler)
export default function authorize(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Forbidden — insufficient role' });
      return;
    }
    next();
  };
}
