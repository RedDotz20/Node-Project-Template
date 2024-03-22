import express from 'express';
import { register, login, logout } from './auth.controller';
import { checkAccessToken } from './auth.middleware';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/logout', checkAccessToken, logout);

router.get('/checkAccessToken', checkAccessToken);

router.get('/profile', checkAccessToken, (req, res) => {
  res.json({ user: req.user });
});

export default router;
