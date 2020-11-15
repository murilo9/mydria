import {Schema, Document, model} from 'mongoose';
import { IUser } from './User';
import { IPost } from './Post';

export interface ICommentInput {
  author: String,
  date: Date,
  text: String,
  edited: Boolean
}

export interface IComment extends Document {
  author: IUser,
  post: IPost,
  date: Date,
  text: String,
  edited: Boolean
}

const CommentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author id missing']
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Post id missing']
  },
  date: {
    type: Date,
    default: new Date()
  },
  text: {
    type: String,
    required: [true, 'Comment cannot be empty']
  },
  edited: {
    type: Boolean,
    default: false
  }
})

export default model<IComment>('Comment', CommentSchema);