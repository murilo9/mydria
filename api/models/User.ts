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
  profilePicture: {
    type: String,
    default: null
  },
  taking: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: []
  }
})

export default model<IUser>('User', UserSchema);