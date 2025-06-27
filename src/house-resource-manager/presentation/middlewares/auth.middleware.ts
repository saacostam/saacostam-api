// import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// const secret = process.env.JWT_SECRET!;

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // @ts-ignore;
  req.userId = "default-user";

  next();

  // const authHeader = req.headers.authorization;

  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   return res.status(401).json({ message: 'Missing or invalid token' });
  // }

  // const token = authHeader.split(' ')[1];

  // try {
  //   const payload = jwt.verify(token, secret) as { userId: string };
  //   req.userId = payload.userId; // Attach decoded ID to request
  //   next();
  // } catch (err) {
  //   return res.status(403).json({ message: 'Invalid or expired token' });
  // }
}
