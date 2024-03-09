import express from 'express';
import { register, login } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default router;
