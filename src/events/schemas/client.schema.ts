import * as mongoose from 'mongoose';

const types = mongoose.Schema.Types;

export const ClientSchema = new mongoose.Schema({
  id: types.String,
  type: types.String,
  status: types.String,
  gender: types.String,
  weight: types.Number,
  age: types.Number,
  firstName: types.String,
  lastName: types.String,
  email: types.String,
  phone: types.String,
  address: types.String,
  paymentStatus: types.String,
  withHandCameraVideo: types.Boolean,
  withCameraman: types.Boolean,
  tm: {
    type: types.ObjectId,
    ref: 'Member',
  },
  cameraman: {
    type: types.ObjectId,
    ref: 'Member',
  },
  date: types.Date,
  notes: types.String,
  certificate: types.String,
});

export const PassengerMongooseModel = mongoose.model('Client', ClientSchema);
