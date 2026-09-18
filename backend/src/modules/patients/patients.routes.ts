import express from 'express';
import authenticate, { AuthenticatedRequest } from '../../middleware/authenticate';
import authorize from '../../middleware/authorize';
import PatientProfile from '../../models/PatientProfile';

const router = express.Router();

// Pattern to copy for every other module (logs, appointments, chat, media):
// 1. authenticate  -> confirms who they are
// 2. authorize(...) -> confirms their role is allowed to touch this route at all
// 3. inside the handler -> confirm THIS record actually belongs to req.user.id
//    (never trust an :id in the URL alone — that's the #1 IDOR bug class, see Notion Phase 7)
router.get('/me', authenticate, authorize('patient'), async (req: AuthenticatedRequest, res) => {
  const profile = await PatientProfile.findOne({ userId: req.user?.id });
  if (!profile) {
    res.status(404).json({ error: 'Profile not found' });
    return;
  }
  res.json(profile);
});

export default router;
