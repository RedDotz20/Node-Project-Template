import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import keys from '../config/keys';

const verifyAccessToken = (accessToken: string): Promise<Record<string, any>> => {
  return new Promise((resolve, reject) => {
    jwt.verify(accessToken, keys.accessTokenSecret, (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve(user as Record<string, any>);
      }
    });
  });
};

const verifyRefreshToken = (refreshToken: string): Promise<Record<string, any>> => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, keys.refreshTokenSecret, (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve(user as Record<string, any>);
      }
    });
  });
};

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract the access token from the Authorization header
    const accessToken = req.headers.authorization?.split(' ')[1];

    if (!accessToken) {
      return res.status(401).json({ error: 'Unauthorized - Access token missing' });
    }

    // Verify the access token
    const user = await verifyAccessToken(accessToken);

    // Attach the user information to the request for further handling in the route
    req.user = user;
    next();
  } catch (error) {
    // If the access token verification fails, check the refresh token
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Unauthorized - Refresh token missing' });
    }

    try {
      // Verify the refresh token
      const user = await verifyRefreshToken(refreshToken);

      // Attach the user information to the request for further handling in the route
      req.user = user;

      // If the refresh token is valid, issue a new access token (optional)
      const newAccessToken = jwt.sign({ id: user.id, username: user.username }, keys.accessTokenSecret, {
        expiresIn: 3600,
      });
      res.cookie('accessToken', newAccessToken, { httpOnly: true });

      next();
    } catch (refreshError) {
      return res.status(401).json({ error: 'Unauthorized - Invalid tokens' });
    }
  }
};
