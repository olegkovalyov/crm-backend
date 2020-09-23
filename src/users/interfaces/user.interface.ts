import { Document } from 'mongoose';

export interface IUser extends Document {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  passwordSalt: string,
  passwordHash: string,
  resetPasswordToken?: string,
  resetPasswordExpirationDate?: Date,
  refreshToken?: string,
  refreshTokenExpirationDate?: Date,
  role: UserRole,
  createdAt: Date,
  updatedAt: Date,
  licenseType?: LicenseType,
}

export enum UserRole {
  STUDENT = 'STUDENT',
  SKYDIVER = 'SKYDIVER',
  INSTRUCTOR = 'INSTRUCTOR',
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
