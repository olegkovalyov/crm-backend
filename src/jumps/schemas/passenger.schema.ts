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
  operator: {
    type: types.ObjectId,
    ref: 'User',
  },
  instructor: {
    type: types.ObjectId,
    ref: 'User',
  },
  numberOfLoad: types.Number,
  jumpDate: types.Date,
  notes: types.String,
});

export const PassengerMongooseModel = mongoose.model('Passenger', PassengerSchema);
