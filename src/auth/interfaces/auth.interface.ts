export interface ITokens {
  accessToken: string,
  refreshToken: string,
}

export interface IDecodedRefreshToken {
  email: string,
  iat: number,
  exp: number
}

