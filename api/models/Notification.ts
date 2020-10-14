import {Schema, Document, model} from 'mongoose';
import { IUser } from './User';
import { IPost } from './Post';

enum NotificationTypes {
  POST_REACTION = 'POST_REACTION',
  POST_SHARED = 'POST_SHARED',
  POST_COMMENTED = 'POST_COMMENTED',
  FOLLOW = 'FOLLOW'
}

export interface INotificationInput {
  type: NotificationTypes,
  user: string,
  follower: string,
  post: string
}

export interface INotification extends Document {
  type: NotificationTypes,
  user: IUser,
  follower: IUser,
  post: IPost
}

const NotificationSchema = new Schema({
  type: {
    type: NotificationTypes,
    required: [true, 'Notification type missing']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User id missing']
  },
  follower: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    default: null
  }
})

export default model<INotification>('Notification', NotificationSchema)