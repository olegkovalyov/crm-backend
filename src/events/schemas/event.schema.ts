import * as mongoose from 'mongoose';

const types = mongoose.Schema.Types;

export const EventSchema = new mongoose.Schema({
  id: types.String,
  name: types.String,
  date: types.Date,
  loads: [{
    type: types.ObjectId,
    ref: 'Load',
  }],
  staff: [{
    type: types.ObjectId,
    ref: 'Member',
  }],
  notes: types.String,
});

export const EventMongooseModel = mongoose.model('Event', EventSchema);
