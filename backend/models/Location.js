import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const locationSchema = new Schema({
    location: { type: String, required: true, unique: true },
    passKey: { type: String, required: true },
    email: { type: String, required: true},
    name: { type: String, required: true},
    tournaments: [{ type: Schema.Types.ObjectId, ref: 'Tournament' }]
});

export default model('Location', locationSchema);
