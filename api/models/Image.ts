import {Schema, Document, model} from 'mongoose';

export interface IImage {
  file: String,
  date: Date
}

const ImageSchema = new Schema({
  date: {
    type: Date,
    default: new Date()
  },
  owner: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    required: [true, 'User id missing for picture instance']
  },
  extention: {
    type: String,
    required: [true, 'Image extention missing for picture instance']
  }
})

export default model<IImage>('Image', ImageSchema);