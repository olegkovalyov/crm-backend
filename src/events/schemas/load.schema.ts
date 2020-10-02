import * as mongoose from 'mongoose';

const types = mongoose.Schema.Types;

export const LoadSchema = new mongoose.Schema({
  id: types.String,
  event: {
    type: types.ObjectId,
    ref: 'Event',
  },
  status: types.String,
  date: types.Date,
  loadNumber: types.Number,
  aircraft: types.String,
  notes: types.String,
});

export const LoadMongooseModel = mongoose.model('Load', LoadSchema);
