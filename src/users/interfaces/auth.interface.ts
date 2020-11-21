export interface Tokens {
  accessToken: string,
  refreshToken: string,
}

export interface DecodedRefreshTokenInterface {
  email: string,
  iat: number,
  exp: number
}

