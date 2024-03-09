import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import keys from '../config/keys';
import User, { IUser } from '../models/user.model';

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

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
      const payload = { id: user.id, username: user.username };
      const token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 });

      // Set the token in an HTTP-only cookie
      res.cookie('jwtToken', token, { httpOnly: true });

      res.json({ success: true, token: `Bearer ${token}` });
    } else {
      res.status(400).json({ error: 'Password incorrect' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  // Clear the JWT token cookie
  res.clearCookie('jwtToken');
  res.json({ success: true });
};
