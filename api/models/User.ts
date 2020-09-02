import {Schema, Document, model} from 'mongoose';

export interface IUser extends Document {
  email: String,
  password: String,
  nickname: String
}

export interface IUserInput {
  email: String,
  password: String,
  nickname: String
}

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'You must input your e-mail address']
  },
  password: {
    type: String,
    required: [true, 'You must input a password']
  },
  nickname: {
    type: String,
    required: [true, 'You must input a nickname'] 
  },
  bio: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
  profilePicture: {
    type: String,
    default: null
  },
  following: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  followedBy: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: []
  }
})

export default model<IUser>('User', UserSchema);