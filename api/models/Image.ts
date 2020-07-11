import {Schema, Document, model} from 'mongoose';

export interface IImage {
  file: String,
  date: Date
}

const ImageSchema = new Schema({
  file: {
    type: String,
    required: [true, 'File name missing']
  },
  date: {
    type: Date,
    default: new Date()
  },
})

export default model<IImage>('Image', ImageSchema);