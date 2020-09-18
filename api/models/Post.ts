import {Schema, Document, model} from 'mongoose';
import { IUser } from './User';
import { IComment, ICommentInput } from './Comment';

export interface IPost extends Document {
  author: IUser,
  tags: Array<String>,
  date: Date,
  text: String,
  img: String,
  likedBy: Array<IUser>,
  unlikedBy: Array<IUser>,
  comments: Array<IComment>
}

export interface IPostInput {
  author: String,
  tags: Array<String>,
  date: Date,
  text: String,
  comments: Array<ICommentInput>
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
    type: Schema.Types.ObjectId,
    ref: 'Image',
    default: null
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
  },
  comments: {
    type: [Schema.Types.ObjectId],
    ref: 'Comment',
    default: []
  }
})

export default model<IPost>('Post', PostSchema);