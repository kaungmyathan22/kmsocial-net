import { CurrentUser } from '@auth/controllers/current-user';
import { authMiddleware } from '@global/helpers/auth-middleware';
import express, { Router } from 'express';

class CurrentUserRoute {
  private router: Router;
  constructor() {
    this.router = express.Router();
  }
  public routes(): Router {
    this.router.get(
      '/currentuser',
      authMiddleware.checkAuthentication,
      CurrentUser.prototype.read
    );
    return this.router;
  }
}

const currentUserRoutes: CurrentUserRoute = new CurrentUserRoute();
export { currentUserRoutes };
