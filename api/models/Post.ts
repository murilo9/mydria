import {Schema, Document, model} from 'mongoose';
import { IUser } from './User';

export interface IPost extends Document {
  author: IUser,
  tags: Array<String>,
  date: Date,
  text: String,
  img: String,
  likedBy: Array<IUser>,
  unlikedBy: Array<IUser>
}

export interface IPostInput {
  author: String,
  tags: Array<String>,
  date: Date,
  text: String,
}

const PostSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User id missing']
  },
  tags: {
    type: [String],
    default: []
  },
  date: {
    type: Date,
    default: new Date()
  },
  text: {
    type: String
  },
  img: {
    type: String
  },
  likedBy: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  unlikedBy: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: []
  }
})

export default model<IPost>('Post', PostSchema);