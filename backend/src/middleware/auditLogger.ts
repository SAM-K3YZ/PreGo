import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticate';
import AuditLog from '../models/AuditLog';

// Wrap any sensitive read/write with this to get an immutable trail of
// who touched what. Fire-and-forget so it never blocks the response,
// but errors are logged loudly since a silent audit-log failure is its own risk.
export default function auditLog(action: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    AuditLog.create({
      actorId: req.user?.id,
      action,
      targetId: req.params.id,
      ipAddress: req.ip,
    }).catch((err) => console.error('AUDIT LOG WRITE FAILED:', action, err));
    next();
  };
}
