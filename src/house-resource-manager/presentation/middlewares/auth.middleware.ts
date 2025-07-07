import { JwtTokenServiceImpl } from '../../infra/providers';
import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors';

const jwtTokenService = new JwtTokenServiceImpl();

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError();
  }

  const token = authHeader.split(' ')[1];

  const payload = jwtTokenService.validateToken(token);
    
  if (payload === undefined) throw new UnauthorizedError();

  // @ts-ignore
  req.userId = 
    payload.userId
  
  next();
}
