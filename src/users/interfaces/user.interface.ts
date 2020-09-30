import { Document } from 'mongoose';

export interface IUser extends Document {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  passwordSalt: string,
  passwordHash: string,
  resetPasswordToken: string | null,
  resetPasswordExpirationDate: Date | null,
  refreshToken: string | null,
  refreshTokenExpirationDate: Date | null,
  role: UserRole,
  createdAt: Date,
  updatedAt: Date,
  licenseType?: LicenseType,
}

export enum UserRole {
  STUDENT = 'STUDENT',
  SKYDIVER = 'SKYDIVER',
  INSTRUCTOR = 'INSTRUCTOR',
  TM = 'TM',
  PACKER = 'PACKER',
  RIGGER = 'RIGGER',
  MANIFEST = 'MANIFEST',
  ADMIN = 'ADMIN',
}

export enum LicenseType {
  NONE = 'NONE',
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}
