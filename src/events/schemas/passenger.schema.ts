import * as mongoose from 'mongoose';

const types = mongoose.Schema.Types;

export const PassengerSchema = new mongoose.Schema({
  id: types.String,
  status: types.String,
  firstName: types.String,
  lastName: types.String,
  phone: types.String,
  gender: types.String,
  weight: types.Number,
  handCamera: types.Boolean,
  cameraman: types.Boolean,
  date: types.Date,
  notes: types.String,
});

export const PassengerMongooseModel = mongoose.model('Passenger', PassengerSchema);
