import {Request, Response} from "express";
import User from '../models/User';
import validateUserForm from '../middleware/ValidateUserForm';

export default class UserRoutes {

  public routes(app, verifyJWT): void {

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
        await requester.save();
        res.status(200).send(requester.following);
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
      if(!userToUnfollowId){
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
        res.status(200).send(requester.following);
        return
      }
      else{
        res.status(202).send('You are currently not following this person');
      }
    })
  }
}