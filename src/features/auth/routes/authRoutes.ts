import { SignIn } from '@auth/controllers/signin';
import { SignOut } from '@auth/controllers/signout';
import { SignUp } from '@auth/controllers/signup';
import express, { Router } from 'express';

class AuthRoute {
  private router: Router;
  constructor() {
    this.router = express.Router();
  }
  public routes(): Router {
    this.router.post('/signup', SignUp.prototype.create);
    this.router.post('/signin', SignIn.prototype.read);
    return this.router;
  }
  public signoutroutes(): Router {
    this.router.get('/signout', SignOut.prototype.update);
    return this.router;
  }
}

const authRoutes: AuthRoute = new AuthRoute();
export { authRoutes };
