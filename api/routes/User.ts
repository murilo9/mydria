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

    //POST em /take/userId - Segue um usuário

    app.route('/take/:userId')
    .all((req: Request, res: Response, next) => {
      verifyJWT(req, res, () => { next() })
    })

    .post(async (req, res: Response) => {
      console.log('POST em /take/'+req.params.userId)
      const userToTakeId = req.params.userId;
      const requester = await User.findOne({_id: req.requesterId}).exec();
      if(!requester){
        res.status(500).send("Requester not found");
        return;
      }
      const userToTake = await User.findOne({_id: userToTakeId}).exec();
      if(!userToTake){
        res.status(404).send("User not found");
        return;
      }
      //Verifica se não é uma request pra seguir a si mesmo:
      if(userToTakeId === req.requesterId){
        res.status(202).send("You can't take yourself :c");
        return;
      }
      //Verifica se você ja não está seguindo o usuário:
      let alreadyTook = false;
      requester.taking.forEach(userTaking => {
        if(userTaking.toString() === userToTakeId){
          alreadyTook = true;
        }
      });
      if(alreadyTook){
        res.status(202).send('Already taking');
        return;
      }
      else{
        requester.taking.push(userToTakeId);
        await requester.save();
        res.status(200).send(requester.taking);
      }
    })

    //DELETE em /take/:userId - Deixa de seguir um usuário

    .delete(async (req, res: Response) => {
      console.log('DELETE em /take/'+req.params.userId)
      const userToUntakeId = req.params.userId;
      const requester = await User.findOne({_id: req.requesterId}).exec();
      if(!requester){
        res.status(500).send("Requester not found");
        return;
      }
      const userToUntake = await User.findOne({_id: userToUntakeId}).exec();
      if(!userToUntakeId){
        res.status(404).send("User not found");
        return;
      }
      //Verifica se você está seguindo o usuário:
      let taking = -1;
      requester.taking.forEach((userTaking, i) => {
        if(userTaking.toString() === userToUntakeId){
          taking = i;
        }
      });
      if(taking > -1){
        requester.taking.splice(taking, 1);
        await requester.save();
        res.status(200).send(requester.taking);
        return
      }
      else{
        res.status(202).send('You are currently not taking this person');
      }
    })
  }
}