import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import keys from '../config/keys';
import User, { IUser } from '../models/user.model';

const generateAccessToken = (user: IUser): string => {
  return jwt.sign({ id: user.id, username: user.username }, keys.accessTokenSecret, { expiresIn: '15m' });
};

const generateRefreshToken = (user: IUser): string => {
  return jwt.sign({ id: user.id, username: user.username }, keys.refreshTokenSecret, { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ error: 'Username already exists' });
      return;
    }

    const newUser: IUser = new User({ username, password });
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Set the tokens in HTTP-only cookies
      res.cookie('accessToken', accessToken, { httpOnly: true });
      res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days

      res.json({ success: true, accessToken, refreshToken });
    } else {
      res.status(400).json({ error: 'Password incorrect' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  // Clear the tokens in HTTP-only cookies
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ success: true });
};
