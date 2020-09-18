import {Schema, Document, model} from 'mongoose';
import { IUser } from './User';

export interface ICommentInput {
  author: String,
  date: Date,
  text: String
}

export interface IComment extends Document {
  author: IUser,
  date: Date,
  text: String
}

const CommentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User id missing']
  },
  date: {
    type: Date,
    default: new Date()
  },
  text: {
    type: String
  }
})

export default model<IComment>('Comment', CommentSchema);