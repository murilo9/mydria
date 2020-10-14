import {Request, Response} from "express";
import Notification from '../models/Notification';
import User from '../models/User';
import Post, {IPost, IPostInput} from '../models/Post';
import Comment from '../models/Comment';

export default class NotificationRoutes {

  public routes(app, verifyJWT): void {

    //GET em /notifications - Lê todas as netoficações do usuário

    app.get('/notifications', async(req, res: Response) => {
      console.log('GET em /notifications');
      const requesterId = req.requesterId;
      const notifications = await Notification.find({user: requesterId})
      .populate('follower').populate('post').exec();
      res.status(200).send(notifications);
    })

    app.delete('/notifications/:notifId', async(req, res: Response) => {
      console.log('GET em /notifications/'+req.params.notifId);
      const requesterId = req.requesterId;
      const notifId = req.params.notifId;
      let notification = await Notification.findOne({user: requesterId, _id: notifId}).exec();
      if(notification){
        await Notification.deleteOne({_id: notifId}).exec();
        res.status(200).send('Notification deleted successfully.');
      }
      else{
        res.status(403).send('That notification is not yours.');
      }
    })
  }
}