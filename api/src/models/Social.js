import mongoose from 'mongoose';
import { string } from './schemaTypes';

const { Schema } = mongoose;

const socialSchema = new Schema({
    name: string,
    url: string
})

export const Social = mongoose.model("Social", socialSchema);