import * as mongoose from 'mongoose';

const types = mongoose.Schema.Types;

export const ClientSchema = new mongoose.Schema({
  id: types.String,
  status: types.String,
  firstName: types.String,
  lastName: types.String,
  phone: types.String,
  gender: types.String,
  weight: types.Number,
  withHandCameraVideo: types.Boolean,
  withCameraman: types.Boolean,
  onlyFlight: types.Boolean,
  paid: types.Boolean,
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
});

export const PassengerMongooseModel = mongoose.model('Client', ClientSchema);
