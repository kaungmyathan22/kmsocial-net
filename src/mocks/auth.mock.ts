import { AuthPayload, IAuthDocument } from '@auth/interfaces/auth.interface';
import { Response } from 'express';

export const authMockRequest = (sessionData: IJWT, body: IAuthMock, currentUser?: AuthPayload | null, params?: any) => ({
  session: sessionData,
  body,
  params,
  currentUser
});

export const authMockResponse = (): Response => {
  const res: Response = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

export interface IJWT {
  jwt?: string;
}

export interface IAuthMock {
  _id?: string;
  username?: string;
  email?: string;
  uId?: string;
  password?: string;
  avatarColor?: string;
  avatarImage?: string;
  createdAt?: Date | string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  quote?: string;
  work?: string;
  school?: string;
  location?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  messages?: boolean;
  reactions?: boolean;
  comments?: boolean;
  follows?: boolean;
}

export const authUserPayload: AuthPayload = {
  userId: '60263f14648fed5246e322d9',
  uId: '1621613119252066',
  username: 'Manny',
  email: 'manny@me.com',
  avatarColor: '#9c27b0',
  iat: 12345
};

export const authMock = {
  _id: '60263f14648fed5246e322d3',
  uId: '1621613119252066',
  username: 'Manny',
  email: 'manny@me.com',
  avatarColor: '#9c27b0',
  createdAt: '2022-08-31T07:42:24.451Z',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  save: () => { },
  comparePassword: () => false
} as unknown as IAuthDocument;

export const signUpMockData = {
  '_id': '63838b5704e00bd4e7c94575',
  password: '',
  'profilePicture': 'https://res/cloudinary.com/kmhs-instagram-clone/images/uploads/1669565284/63838b5704e00bd4e7c94575',
  'postsCount': 0,
  'followersCount': 0,
  'followingCount': 0,
  'blocked': [],
  'blockedBy': [],
  'notifications': {
    'messages': true,
    'reactions': true,
    'comments': true,
    'follows': true
  },
  'social': {
    'facebook': '',
    'instagram': '',
    'twitter': '',
    'youtube': ''
  },
  'work': '',
  'school': '',
  'location': '',
  'quote': '',
  'bgImageVersion': '',
  'bgImageId': '',
  'username': 'Arkar',
  'uId': '105550571165',
  'email': 'arkar@gmail.com',
  'avatarColor': 'blue',
  'createdAt': '2022-11-27T16:07:51.331Z',
  'authId': '63838b5704e00bd4e7c94574',
};
