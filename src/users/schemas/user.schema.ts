import * as mongoose from 'mongoose';

const types = mongoose.Schema.Types;

export const UserSchema = new mongoose.Schema({
  id: types.String,
  firstName: types.String,
  lastName: types.String,
  email: {
    type: types.String,
    unique: true,
  },
  resetPasswordToken: types.String,
  resetPasswordExpirationDate: types.Date,
  refreshToken: types.String,
  refreshTokenExpirationDate: types.Date,
  passwordHash: types.String,
  passwordSalt: types.String,
  role: types.String,
  createdAt: types.Date,
  updatedAt: types.Date,
  licenseType: types.String,
});

export const UserMongooseModel = mongoose.model('User', UserSchema);
