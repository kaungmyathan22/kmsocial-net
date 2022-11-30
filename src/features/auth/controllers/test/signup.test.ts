
import * as cloudinarUploads from '@global/helpers/cloudinary-uploads';
import { CustomError } from '@global/helpers/error-handler';
import { authMock, authMockRequest, authMockResponse } from '@root/mocks/auth.mock';
import { authService } from '@services/db/auth.service';
import { UserCache } from '@services/redis/user.cache';
import { Request, Response } from 'express';
import { SignUp } from '../signup';

jest.mock('@services/queues/base.queue');
jest.mock('@services/redis/user.cache');
jest.mock('@services/queues/user.queue');
jest.mock('@services/queues/auth.queue');
jest.mock('@global/helpers/cloudinary-uploads');

describe('SignUp', () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if username is not available.', () => {
    const req: Request = authMockRequest({}, {
      username: '', email: 'asd@gmail.com', password: 'qwerty', avatarColor: 'red', avatarImage: 'asdfsf'
    },) as Request;
    const res: Response = authMockResponse();
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Username is a required field');
    });
  });

  it('should throw an error if username length is less than the minimum length.', () => {
    const req: Request = authMockRequest({}, {
      username: 'ma', email: 'asd@gmail.com', password: 'qwerty', avatarColor: 'red', avatarImage: 'asdfsf'
    },) as Request;
    const res: Response = authMockResponse();
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid username');
    });
  });
  it('should throw an error if username length is greater than the maximum length.', () => {
    const req: Request = authMockRequest({}, {
      username: 'ma212121212', email: 'asd@gmail.com', password: 'qwerty', avatarColor: 'red', avatarImage: 'asdfsf'
    },) as Request;
    const res: Response = authMockResponse();
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid username');
    });
  });

  it('should throw an error if email is invalid.', () => {
    const req: Request = authMockRequest({}, {
      username: 'ma243', email: 'asd', password: 'qwerty', avatarColor: 'red', avatarImage: 'asdfsf'
    },) as Request;
    const res: Response = authMockResponse();
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Email must be valid');
    });
  });

  it('should throw an error if email is provided.', () => {
    const req: Request = authMockRequest({}, {
      username: 'ma243', email: '', password: 'qwerty', avatarColor: 'red', avatarImage: 'asdfsf'
    },) as Request;
    const res: Response = authMockResponse();
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Email is a required field');
    });
  });

  it('should throw an error if password is provided.', () => {
    const req: Request = authMockRequest({}, {
      username: 'ma243', email: 'a@gmail.com', password: '', avatarColor: 'red', avatarImage: 'asdfsf'
    },) as Request;
    const res: Response = authMockResponse();
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Password is a required field');
    });
  });

  it('should throw an error if password length is less than the minimum length.', () => {
    const req: Request = authMockRequest({}, {
      username: 'adfsa', email: 'asd@gmail.com', password: 'qw', avatarColor: 'red', avatarImage: 'asdfsf'
    },) as Request;
    const res: Response = authMockResponse();
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid password');
    });
  });

  it('should throw an error if password length is greater than the maximum length.', () => {
    const req: Request = authMockRequest({}, {
      username: 'ma222', email: 'asd@gmail.com', password: 'qwerty1111111111', avatarColor: 'red', avatarImage: 'asdfsf'
    },) as Request;
    const res: Response = authMockResponse();
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid password');
    });
  });

  it('should throw unauthorize error if user already exist', () => {
    const req: Request = authMockRequest({}, {
      username: 'ma222', email: 'asd@gmail.com', password: 'qwerty', avatarColor: 'red', avatarImage: 'asdf'
    },) as Request;
    const res: Response = authMockResponse();
    jest.spyOn(authService, 'getUserByUsernameOrEmail').mockResolvedValue(authMock);
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid credentials');
    });
  });

  it('should set session data for valid credentials and send correct json response.', async () => {
    const req: Request = authMockRequest({}, {
      username: 'ma222', email: 'asd@gmail.com', password: 'qwerty', avatarColor: 'red', avatarImage: 'asdf'
    },) as Request;
    const res: Response = authMockResponse();

    jest.spyOn(authService, 'getUserByUsernameOrEmail').mockResolvedValue(null as any);

    const userSpy = jest.spyOn(UserCache.prototype, 'saveUserToCache');

    jest.spyOn(cloudinarUploads, 'uploads').mockImplementation((): any => Promise.resolve({ version: '1212', public_id: '123456' }));

    await SignUp.prototype.create(req, res);
    const token = req.session?.jwt;
    expect(token).toBeDefined();
    expect(res.json).toHaveBeenCalledWith({
      message: 'User created successfully.',
      user: userSpy.mock.calls[0][2],
      token
    });
  });
});
