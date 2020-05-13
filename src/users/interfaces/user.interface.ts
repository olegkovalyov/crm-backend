import {Document} from 'mongoose';

export interface UserInterface extends Document{
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  passwordSalt: string,
  passwordHash: string,
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
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}
