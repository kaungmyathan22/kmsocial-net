import { AuthPayload } from '@auth/interfaces/auth.interface';
import { config } from '@root/config';
import { NextFunction, Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import { NotAuthorizedError } from './error-handler';

export class AuthMiddleware {
  public verifyUser(request: Request, _res: Response, next: NextFunction) {
    if (!request.session?.jwt) {
      throw new NotAuthorizedError(
        'Token is not available. Please login again.'
      );
    }
    try {
      const payload: AuthPayload = JWT.verify(
        request.session?.jwt,
        config.JWT_TOKEN!
      ) as AuthPayload;
      request.currentUser = payload;
    } catch (error) {
      throw new NotAuthorizedError('Token is invalid. Please login again.');
    }
    next();
  }

  public checkAuthentication(
    request: Request,
    _res: Response,
    next: NextFunction
  ) {
    if (!request.session?.jwt) {
      throw new NotAuthorizedError(
        'Token is not available. Please login again.'
      );
    }
    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
