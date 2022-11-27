import { userService } from '@services/db/user.service';
import { UserCache } from '@services/redis/user.cache';
import { IUserDocument } from '@user/interfaces/user.interface';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

const userCache: UserCache = new UserCache();

export class CurrentUser {
  public async read(req: Request, res: Response) {
    let isUser = false;
    let token = null;
    let user = null;
    const cachedUser: IUserDocument = (await userCache.getUserFromCache(
      `${req.currentUser!.uId}`
    )) as IUserDocument;
    const existingUser: IUserDocument = cachedUser
      ? cachedUser
      : await userService.getUserById(`${req.currentUser!.uId}`);
    if (Object.keys(existingUser).length) {
      isUser = true;
      token = req.session?.jwt;
      user = existingUser;
    }
    res.status(HTTP_STATUS.OK).json({ token, isUser, user });
  }
}
