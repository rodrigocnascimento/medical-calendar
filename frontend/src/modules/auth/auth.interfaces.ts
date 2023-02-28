export type AuthCredentials = {
  username: string;
  password: string;
};

export type JWTUserToken = {
  exp: EpochTimeStamp;
  iat: EpochTimeStamp;
  expired: boolean;
  sub: string;
  userEmail: string;
  userName: string;
  userRole: string;
};

export type JWTAccessToken = {
  accessToken: string;
};
