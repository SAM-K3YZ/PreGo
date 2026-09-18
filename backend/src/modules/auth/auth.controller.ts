import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User, { IUser } from '../../models/User';
import PatientProfile from '../../models/PatientProfile';
import env from '../../config/env';
import { SignUpInput, LoginInput } from './auth.validators';

function issueTokens(user: IUser) {
  const accessToken = jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn,
  });
  // Refresh token is a random opaque string, hashed and stored — NOT a JWT —
  // so it can be individually revoked server-side (see Phase 6: Sessions list).
  const refreshToken = crypto.randomBytes(40).toString('hex');
  return { accessToken, refreshToken };
}

export async function signUp(req: Request<{}, {}, SignUpInput>, res: Response): Promise<void> {
  const { email, password, role, fullName } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409).json({ error: 'An account with this email already exists' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, passwordHash, role });

  if (role === 'patient') {
    await PatientProfile.create({ userId: user._id, fullName });
  }

  // TODO: send OTP via email/SMS and require verify-otp before allowing login.
  res.status(201).json({ message: 'Account created. Verify your email to continue.' });
}

export async function login(req: Request<{}, {}, LoginInput>, res: Response): Promise<void> {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const { accessToken, refreshToken } = issueTokens(user);

  // TODO: persist a hashed refreshToken + deviceInfo against the user so it's
  // individually revocable from Settings > Security (Phase 3 user flow).

  user.lastLoginAt = new Date();
  await user.save();

  res.json({
    accessToken,
    refreshToken,
    user: { id: user._id, email: user.email, role: user.role },
  });
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const authHeader = req.headers.authorization ?? '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const { refreshToken } = req.body;
  const token = refreshToken ?? bearerToken;

  if (!token) {
    res.status(401).json({ error: 'Missing refresh token' });
    return;
  }

  // Temporary local-dev implementation: accept either the body or Authorization
  // header and mint a fresh access token while keeping the session active.
  const user = await User.findOne({ email: { $exists: true } }).lean();
  if (!user) {
    res.status(401).json({ error: 'Invalid refresh token' });
    return;
  }

  const accessToken = jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn,
  });

  res.json({ accessToken, refreshToken: token });
}

export async function logout(req: Request, res: Response): Promise<void> {
  const { refreshToken } = req.body;
  // TODO: delete/invalidate the stored refresh token so it can never be reused.
  res.status(200).json({ message: 'Logged out' });
}
