import {Schema, Document, model} from 'mongoose';
import { IUser } from './User';
import { IPost } from './Post';

export enum NotificationTypes {
  POST_LIKED = 'POST_LIKED',
  POST_UNLIKED = 'POST_UNLIKED',
  POST_SHARED = 'POST_SHARED',
  POST_COMMENTED = 'POST_COMMENTED',
  FOLLOW = 'FOLLOW'
}

export interface INotificationInput {
  type: NotificationTypes,
  user: string,
  from: string,
  post: string,
}

export interface INotification extends Document {
  type: NotificationTypes,
  user: IUser,
  from: IUser,
  post: IPost,
  date: Date
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
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    default: null
  },
  date: {
    type: Date,
    default: new Date()
  }
})

export default model<INotification>('Notification', NotificationSchema)