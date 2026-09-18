import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import { UserRole } from '../models/User';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: UserRole };
}

interface AccessTokenPayload {
  sub: string;
  role: UserRole;
}

// Verifies the access token on every protected route. Does NOT trust any
// role/user data from the request body — only from the signed token.
export default function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or malformed Authorization header' });
    return;
  }

  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, env.jwt.accessSecret) as AccessTokenPayload;
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
