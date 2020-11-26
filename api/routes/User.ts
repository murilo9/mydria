import {Request, Response} from "express";
import User from '../models/User';
import validateUserForm from '../middleware/ValidateUserForm';
import Notification, { NotificationTypes } from '../models/Notification';
import {notificate} from './Notification';
const path = require('path');
const fs = require('fs');

export default class UserRoutes {

  public routes(app, verifyJWT): void {

    app.get('/test', (req, res: Response) => {
      res.status(200).send('Mydria API works!!!');
    })

    app.route('/users')
    .all((req: Request, res: Response, next) => {
      validateUserForm(req, res, () => { next() })
    })

    //POST em /users - Cria um novo usuário

    .post(async (req: Request, res: Response) => {
      console.log('POST em /users')
      const user = new User(req.body);
      await user.save();
      res.status(201).send();   //201 - Created
    });

    //GET em /user/:nickname - Lê os dados de um usuário

    app.route('/user/:nickname')
    .all((req: Request, res: Response, next) => {
      verifyJWT(req, res, () => { next() })
    })

    .get(async (req: Request, res: Response) => {
      console.log('POST em /user/'+req.params.nickname)
      const nickname = req.params.nickname;
      const user = await User.findOne({ nickname }).lean().populate('following').exec();
      if(user){
        delete user.password;
        res.status(200).send(user);
      }
      else{
        res.status(404).send("User not found");
      }
    })

    //PUT em /user/:nickname -  Atualiza os dados de perfil de um usuário

    .put(async(req, res: Response) => {
      console.log('PUT em /user/'+req.params.nickname)
      const requesterId = req.requesterId;
      const nickname = req.params.nickname;
      let user = await User.findOne({ nickname }).exec();
      if(user._id.toString() === requesterId){
        let bio = req.body.bio;
        let country = req.body.country;
        let city = req.body.city;
        let profilePicture = req.body.profilePicture;
        if(bio)
          user.bio = bio;
        if(country)
          user.country = country;
        if(city)
          user.city = city;
        if(profilePicture)
          user.profilePicture = profilePicture;
        await user.save();
        res.status(200).send(user);
      }
      else{
        res.status(403).send('That account is not yours');
      }
    })

    //POST em /follow/userId - Segue um usuário

    app.route('/follow/:userId')
    .all((req: Request, res: Response, next) => {
      verifyJWT(req, res, () => { next() })
    })

    .post(async (req, res: Response) => {
      console.log('POST em /follow/'+req.params.userId)
      const userToFollowId = req.params.userId;
      const requester = await User.findOne({_id: req.requesterId}).exec();
      if(!requester){
        res.status(500).send("Requester not found");
        return;
      }
      const userToFollow = await User.findOne({_id: userToFollowId}).exec();
      if(!userToFollow){
        res.status(404).send("User not found");
        return;
      }
      //Verifica se não é uma request pra seguir a si mesmo:
      if(userToFollowId === req.requesterId){
        res.status(202).send("You can't follow yourself :c");
        return;
      }
      //Verifica se você ja não está seguindo o usuário:
      let alreadyFollowing = false;
      requester.following.forEach(userFollowed => {
        if(userFollowed.toString() === userToFollowId){
          alreadyFollowing = true;
        }
      });
      if(alreadyFollowing){
        res.status(202).send('Already following');
        return;
      }
      else{
        requester.following.push(userToFollowId);
        userToFollow.followedBy.push(req.requesterId);
        await requester.save();
        await userToFollow.save();
        res.status(200).send(requester.following);
        //Envia a notificação pro usuário seguido:
        await notificate(NotificationTypes.FOLLOW, userToFollow._id, requester._id, null);
      }
    })

    //DELETE em /follow/:userId - Deixa de seguir um usuário

    .delete(async (req, res: Response) => {
      console.log('DELETE em /follow/'+req.params.userId)
      const userToUnfollowId = req.params.userId;
      const requester = await User.findOne({_id: req.requesterId}).exec();
      if(!requester){
        res.status(500).send("Requester not found");
        return;
      }
      const userToUnfollow = await User.findOne({_id: userToUnfollowId}).exec();
      if(!userToUnfollow){
        res.status(404).send("User not found");
        return;
      }
      //Verifica se você está seguindo o usuário:
      let following = -1;
      requester.following.forEach((userFollowing, i) => {
        if(userFollowing.toString() === userToUnfollowId){
          following = i;
        }
      });
      if(following > -1){
        requester.following.splice(following, 1);
        await requester.save();
        //Remove você da lista followedBy do usuário seguido:
        following = -1;
        userToUnfollow.followedBy.forEach((userFollowing, i) => {
          if(userFollowing.toString() === req.requesterId){
            following = i;
          }
        })
        if(following > -1){
          userToUnfollow.followedBy.splice(following, 1);
          userToUnfollow.save();
        }
        else{
          console.log('erro: você não estava na lista followedBy do usuário seguido');
        }
        res.status(200).send(requester.following);
      }
      else{
        res.status(202).send('You are currently not following this person');
      }
    })
  }
}